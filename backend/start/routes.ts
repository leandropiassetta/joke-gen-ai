import router from '@adonisjs/core/services/router'
import AuthMiddleware from '#middleware/auth_middleware'

router.get('/health', () => {
  return { status: 'ok' }
})

router.post('/login', '#controllers/login_controller.login')

router
  .get('/joke', '#controllers/jokes_controller.index')
  .middleware([AuthMiddleware()])

router
  .get('/me', '#controllers/login_controller.me')
  .middleware([AuthMiddleware()])


  