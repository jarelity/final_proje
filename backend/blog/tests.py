from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import BlogPost, Category, SectionChoices


class BlogApiTests(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_superuser('admin', 'admin@example.com', 'Admin12345')
        self.category = Category.objects.create(section=SectionChoices.TECHNICAL, name='Python')
        self.post = BlogPost.objects.create(
            section=SectionChoices.TECHNICAL,
            category=self.category,
            title='Django REST API',
            summary='API geliştirme',
            content='Django REST Framework ile API geliştirme yazısı.',
            is_published=True,
        )

    def test_public_user_can_read_posts(self):
        response = self.client.get('/api/posts/?published=true')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_public_user_cannot_create_category(self):
        response = self.client.post('/api/categories/', {'section': 'HOBBIES', 'name': 'Spor'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_admin_can_create_category(self):
        self.client.force_authenticate(self.admin)
        response = self.client.post('/api/categories/', {'section': 'HOBBIES', 'name': 'Spor'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
