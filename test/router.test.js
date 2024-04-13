const conexion = require('../db/db');
const routes = require('../test/router.test.js')
const app = require ('../servidor.js')
const request = require('supertest');

describe('Pruebas de rutas', () => {
    //mi prueba 1: acá valido la primera ruta /
  test('GET / devuelve el HTML de la página de inicio', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toContain('text/html');
  });

  // mi prueba 2: acá valido la segunda ruta /auth
  test('GET /auth devuelve el HTML de la página de autenticación', async () => {
    const response = await request(app).get('/auth');
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toContain('text/html');
  });

  //mi prueba 3: acá valido la student ruta /student
  test('GET /student devuelve el HTML de la página de estudiante', async () => {
    const response = await request(app).get('/student');
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toContain('text/html');
  });

  // mi prueba 4: acá valido la cuarta ruta /company
  test('GET /company devuelve el HTML de la página de compañía', async () => {
    const response = await request(app).get('/company');
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toContain('text/html');
  });

 
  test('GET /register devuelve el HTML de la página de registro', async () => {
    const response = await request(app).get('/register');
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toContain('text/html');
  });

  
  test('GET /logout redirige al usuario a la página de inicio', async () => {
    const response = await request(app).get('/logout');
    expect(response.statusCode).toBe(302); // 302 es el código de redirección
    expect(response.headers.location).toBe('/');
  });

 
  test('POST /auth responde con un token de autenticación válido', async () => {
    const response = await request(app)
      .post('/auth')
      .send({ username: 'usuario', password: 'contraseña' });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

});