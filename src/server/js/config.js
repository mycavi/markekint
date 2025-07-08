if (process.env.NODE_ENV !== 'production') {
  try {
    const dotenv = await import('dotenv');
    dotenv.config();
  } catch (error) {
    console.warn('No se pudo cargar dotenv:', error.message);
  }
}

export const config = {
  app_name: process.env.PUBLIC_APP_NAME,
  app_key: process.env.PUBLIC_APP_KEY ?? 'base64:+8/hR+nFtuYirVAFlZe46U5aqRoQRva1pmT+uJjaOao=',
  api_url: process.env.PUBLIC_API_URL ?? 'https://api.mycavi.com',
  api_key: process.env.PUBLIC_API_KEY,
  cookie_preview: process.env.COOKIE_PRDVIEWS,
  captcha_site: process.env.CAPTCHA_SITE,
  captcha_secret: process.env.CAPTCHA_SECRET,
  virtualcavi_key: process.env.VIRTUALCAVI_PUBLIC_KEY,
  mail_user: process.env.MAIL_USERNAME,
  mail_pass: process.env.MAIL_PASSWORD,
  mail_receiver: process.env.MAIL_ADMIN,
  mail_host: process.env.MAIL_HOST ?? 'localhost',
  mail_port: process.env.MAIL_PORT ?? 26,
};