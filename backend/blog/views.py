from django.db.models import Count
from rest_framework import viewsets
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from .models import AboutProfile, AuditLog, BlogPost, Category
from .permissions import IsAdminOrReadOnly
from .serializers import (
    AboutProfileSerializer,
    AuditLogSerializer,
    BlogPostSerializer,
    CategorySerializer,
    get_section_payload,
)


def write_audit(request, action, instance, detail=''):
    user = request.user if request.user.is_authenticated else None
    AuditLog.objects.create(
        action=action,
        model_name=instance.__class__.__name__,
        object_id=str(getattr(instance, 'id', '')),
        username=user.username if user else '',
        detail=detail,
    )


@api_view(['GET'])
@permission_classes([AllowAny])
def sections_view(request):
    return Response(get_section_payload())


@api_view(['GET'])
def me_view(request):
    if not request.user.is_authenticated:
        return Response({'authenticated': False, 'username': '', 'is_staff': False})
    return Response({
        'authenticated': True,
        'username': request.user.username,
        'is_staff': request.user.is_staff,
        'is_superuser': request.user.is_superuser,
    })


class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        queryset = Category.objects.annotate(post_count=Count('posts'))
        section = self.request.query_params.get('section')
        if section:
            queryset = queryset.filter(section=section)
        return queryset

    def perform_create(self, serializer):
        obj = serializer.save()
        write_audit(self.request, 'CREATE', obj, obj.name)

    def perform_update(self, serializer):
        obj = serializer.save()
        write_audit(self.request, 'UPDATE', obj, obj.name)

    def perform_destroy(self, instance):
        write_audit(self.request, 'DELETE', instance, instance.name)
        instance.delete()


class AboutProfileViewSet(viewsets.ModelViewSet):
    queryset = AboutProfile.objects.all().order_by('-updated_at')
    serializer_class = AboutProfileSerializer
    permission_classes = [IsAdminOrReadOnly]
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def current(self, request):
        obj = AboutProfile.objects.order_by('-updated_at').first()
        if not obj:
            return Response(None)
        return Response(self.get_serializer(obj).data)

    def perform_create(self, serializer):
        obj = serializer.save()
        write_audit(self.request, 'CREATE', obj, obj.full_name)

    def perform_update(self, serializer):
        obj = serializer.save()
        write_audit(self.request, 'UPDATE', obj, obj.full_name)


class BlogPostViewSet(viewsets.ModelViewSet):
    serializer_class = BlogPostSerializer
    permission_classes = [IsAdminOrReadOnly]
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def get_queryset(self):
        queryset = BlogPost.objects.select_related('category').all()
        section = self.request.query_params.get('section')
        category_id = self.request.query_params.get('category')
        published = self.request.query_params.get('published')
        search = self.request.query_params.get('search')
        if section:
            queryset = queryset.filter(section=section)
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        is_staff = bool(self.request.user and self.request.user.is_authenticated and self.request.user.is_staff)
        if not is_staff:
            queryset = queryset.filter(is_published=True)
        elif published in ['true', '1', 'True']:
            queryset = queryset.filter(is_published=True)
        elif published in ['false', '0', 'False']:
            queryset = queryset.filter(is_published=False)
        if search:
            queryset = queryset.filter(title__icontains=search) | queryset.filter(content__icontains=search)
        return queryset.distinct()

    def perform_create(self, serializer):
        obj = serializer.save()
        write_audit(self.request, 'CREATE', obj, obj.title)

    def perform_update(self, serializer):
        obj = serializer.save()
        write_audit(self.request, 'UPDATE', obj, obj.title)

    def perform_destroy(self, instance):
        write_audit(self.request, 'DELETE', instance, instance.title)
        instance.delete()


class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AuditLog.objects.all()
    serializer_class = AuditLogSerializer
    permission_classes = [IsAdminUser]
