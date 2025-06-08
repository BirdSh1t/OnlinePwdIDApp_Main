// authController.js
import jwt from 'jsonwebtoken';

export const authController = {
  /**
   * Verify user role and session validity
   */
  async verifySession(req, res) {
    try {
      const token = req.cookies.accessToken || req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({ 
          success: false, 
          message: 'No authentication token found' 
        });
      }

      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      
      res.json({ 
        success: true,
        role: decoded.role,
        id: decoded.id,
        user: decoded // Include full decoded token if needed
      });
    } catch (error) {
      console.error('Session verification error:', error.message);
      
      // Differentiate between token errors
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ 
          success: false, 
          requiresRefresh: true,
          message: 'Token expired' 
        });
      }
      
      res.status(403).json({ 
        success: false, 
        message: 'Invalid token' 
      });
    }
  },

  /**
   * Refresh expired access tokens
   */
  async refreshToken(req, res) {
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) {
      return res.status(401).json({ 
        success: false, 
        message: 'Refresh token required' 
      });
    }

    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      
      // Verify refresh token exists in database
      // (Add your database check here if needed)
      
      const newAccessToken = jwt.sign(
        { 
          id: decoded.id, 
          role: decoded.role 
        },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXP || '15m' }
      );

      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000 // 15 minutes
      });

      res.json({ 
        success: true,
        role: decoded.role // Return role in case frontend needs it
      });
    } catch (error) {
      console.error('Token refresh error:', error.message);
      
      // Clear invalid tokens
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      
      res.status(403).json({ 
        success: false, 
        requiresLogin: true,
        message: 'Invalid refresh token' 
      });
    }
  },

  /**
   * Verify user role (legacy endpoint - can be deprecated)
   */
  async verifyRole(req, res) {
    try {
      const token = req.cookies.accessToken || req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(401).json({ 
          success: false, 
          message: 'Access token required' 
        });
      }

      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

      res.json({
        success: true,
        role: decoded.role,
        id: decoded.id
      });
    } catch (error) {
      console.error('Role verification error:', error.message);
      
      // Special case for token expiration
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ 
          success: false, 
          requiresRefresh: true,
          message: 'Token expired' 
        });
      }
      
      res.status(403).json({ 
        success: false, 
        message: 'Invalid token' 
      });
    }
  }
};