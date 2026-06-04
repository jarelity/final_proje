from django.core.management.base import BaseCommand
from blog.models import AboutProfile, BlogPost, Category, SectionChoices


class Command(BaseCommand):
    help = 'Demo hakkımda, kategori ve blog içerikleri oluşturur.'

    def handle(self, *args, **options):
        about, _ = AboutProfile.objects.update_or_create(
            id=1,
            defaults={
                'full_name': 'Yiğit Şenkara',
                'age': 21,
                'city': 'İzmir',
                'profession': 'Yazılım Mühendisliği Öğrencisi',
                'linkedin_url': 'https://www.linkedin.com/',
                'github_url': 'https://github.com/',
                'description': 'Yazılım geliştirme, web programlama, siber güvenlik ve yapay zeka alanlarına ilgi duyan bir öğrenciyim. Bu blogda teknik notlarımı, araştırmalarımı, hobilerimi ve okuduğum kitapları paylaşıyorum.',
            },
        )

        demo_categories = [
            (SectionChoices.TECHNICAL, 'Web Programlama', 'Frontend ve backend geliştirme notları'),
            (SectionChoices.TECHNICAL, 'Yapay Zeka', 'Makine öğrenmesi ve yapay zeka çalışmaları'),
            (SectionChoices.NON_TECHNICAL, 'Kişisel Gelişim', 'Ders dışı notlar'),
            (SectionChoices.RESEARCH, 'Siber Güvenlik', 'Güvenlik araştırmaları'),
            (SectionChoices.HOBBIES, 'Fitness', 'Spor ve sağlıklı yaşam'),
            (SectionChoices.BOOKS, 'Teknik Kitaplar', 'Okunan teknik kitaplar'),
        ]
        categories = {}
        for section, name, description in demo_categories:
            category, _ = Category.objects.get_or_create(section=section, name=name, defaults={'description': description})
            categories[(section, name)] = category

        demo_posts = [
            (SectionChoices.TECHNICAL, 'Web Programlama', 'Angular ve Django ile Blog Projesi', 'Bu yazıda Angular frontend, Django REST backend ve PostgreSQL veritabanı kullanarak kişisel blog projesi geliştirme sürecini anlatıyorum.'),
            (SectionChoices.TECHNICAL, 'Yapay Zeka', 'Makine Öğrenmesine Giriş', 'Makine öğrenmesi modellerinin temel amacı geçmiş verilerden örüntü öğrenerek yeni veriler üzerinde tahmin yapmaktır.'),
            (SectionChoices.NON_TECHNICAL, 'Kişisel Gelişim', 'Düzenli Çalışma Alışkanlığı', 'Düzenli çalışma alışkanlığı kazanmak için küçük hedefler belirlemek ve süreci takip etmek önemlidir.'),
            (SectionChoices.RESEARCH, 'Siber Güvenlik', 'JWT Kimlik Doğrulama', 'JWT tabanlı kimlik doğrulama, stateless API mimarilerinde sık kullanılan bir yöntemdir.'),
            (SectionChoices.HOBBIES, 'Fitness', 'Haftalık Antrenman Planı', 'Fitness çalışmalarında sürdürülebilir program ve doğru beslenme başarıyı etkiler.'),
            (SectionChoices.BOOKS, 'Teknik Kitaplar', 'Clean Code Notları', 'Clean Code kitabı okunabilir, sürdürülebilir ve temiz kod yazmanın önemini vurgular.'),
        ]
        for section, category_name, title, content in demo_posts:
            BlogPost.objects.get_or_create(
                section=section,
                category=categories[(section, category_name)],
                title=title,
                defaults={'summary': content[:150], 'content': content, 'is_published': True},
            )

        self.stdout.write(self.style.SUCCESS('Demo verileri oluşturuldu.'))
