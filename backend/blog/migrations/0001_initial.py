# Generated for completed course project
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name='AboutProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('full_name', models.CharField(max_length=120)),
                ('age', models.PositiveSmallIntegerField()),
                ('city', models.CharField(max_length=80)),
                ('profession', models.CharField(max_length=120)),
                ('linkedin_url', models.URLField(blank=True)),
                ('github_url', models.URLField(blank=True)),
                ('description', models.TextField()),
                ('photo', models.ImageField(blank=True, null=True, upload_to='about/')),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={'verbose_name': 'Hakkımda Profili', 'verbose_name_plural': 'Hakkımda Profilleri'},
        ),
        migrations.CreateModel(
            name='AuditLog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('action', models.CharField(max_length=80)),
                ('model_name', models.CharField(max_length=80)),
                ('object_id', models.CharField(blank=True, max_length=40)),
                ('username', models.CharField(blank=True, max_length=150)),
                ('detail', models.TextField(blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={'verbose_name': 'Denetim Kaydı', 'verbose_name_plural': 'Denetim Kayıtları', 'ordering': ['-created_at']},
        ),
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('section', models.CharField(choices=[('ABOUT', 'Hakkımda'), ('TECHNICAL', 'Teknik Bilgi'), ('NON_TECHNICAL', 'Teknik Olmayan Bilgi'), ('RESEARCH', 'Araştırmalarım'), ('HOBBIES', 'Hobilerim'), ('BOOKS', 'Okuduğum Kitaplar')], max_length=30)),
                ('name', models.CharField(max_length=120)),
                ('slug', models.SlugField(blank=True, max_length=140)),
                ('description', models.TextField(blank=True)),
            ],
            options={'verbose_name': 'Kategori', 'verbose_name_plural': 'Kategoriler', 'ordering': ['section', 'name']},
        ),
        migrations.CreateModel(
            name='BlogPost',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('section', models.CharField(choices=[('ABOUT', 'Hakkımda'), ('TECHNICAL', 'Teknik Bilgi'), ('NON_TECHNICAL', 'Teknik Olmayan Bilgi'), ('RESEARCH', 'Araştırmalarım'), ('HOBBIES', 'Hobilerim'), ('BOOKS', 'Okuduğum Kitaplar')], max_length=30)),
                ('title', models.CharField(max_length=180)),
                ('slug', models.SlugField(blank=True, max_length=220)),
                ('summary', models.CharField(blank=True, max_length=320)),
                ('content', models.TextField()),
                ('image', models.ImageField(blank=True, null=True, upload_to='posts/')),
                ('is_published', models.BooleanField(default=True)),
                ('category', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='posts', to='blog.category')),
            ],
            options={'verbose_name': 'Blog Yazısı', 'verbose_name_plural': 'Blog Yazıları', 'ordering': ['-created_at']},
        ),
        migrations.AddConstraint(
            model_name='category',
            constraint=models.UniqueConstraint(fields=('section', 'name'), name='unique_category_per_section'),
        ),
    ]
