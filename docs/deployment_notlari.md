# Yayına Alma Notları

## Backend

1. Render veya Railway üzerinde Python web service oluştur.
2. PostgreSQL database oluştur.
3. Ortam değişkenlerini `.env.example` dosyasındaki isimlerle ekle.
4. Build komutu: `pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate`
5. Start komutu: `gunicorn config.wsgi:application`

## Frontend

1. Netlify veya Vercel üzerinde frontend klasörünü seç.
2. Build komutu: `npm run build`
3. Publish klasörü: `dist/kisisel-blog-frontend/browser`
4. `environment.prod.ts` içindeki API URL'ini canlı backend adresi yap.
