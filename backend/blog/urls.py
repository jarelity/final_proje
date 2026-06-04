from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import AuditLogViewSet, AboutProfileViewSet, BlogPostViewSet, CategoryViewSet, me_view, sections_view

router = DefaultRouter()
router.register('about', AboutProfileViewSet, basename='about')
router.register('categories', CategoryViewSet, basename='category')
router.register('posts', BlogPostViewSet, basename='post')
router.register('audit-logs', AuditLogViewSet, basename='audit-log')

urlpatterns = [
    path('sections/', sections_view, name='sections'),
    path('auth/me/', me_view, name='me'),
    path('', include(router.urls)),
]
