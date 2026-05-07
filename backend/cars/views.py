from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Car, Brand, CarModel, CarImage
from .serializers import CarSerializer, BrandSerializer, CarModelSerializer, MyTokenObtainPairSerializer
from .filters import CarFilter
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import action
from rest_framework.response import Response
# 1. Добавляем импорт пагинации
from rest_framework.pagination import PageNumberPagination


# 2. Создаем класс, который позволит фронтенду самому запрашивать нужное кол-во элементов
class StandardResultsSetPagination(PageNumberPagination):
    page_size = 12  # Размер по умолчанию (как в settings.py)
    page_size_query_param = 'page_size'  # Это позволит делать ?page_size=999
    max_page_size = 1000


class CarViewSet(viewsets.ModelViewSet):
    queryset = Car.objects.all()
    serializer_class = CarSerializer
    # 3. Указываем, что этот ViewSet использует наш новый класс пагинации
    pagination_class = StandardResultsSetPagination

    filter_backends = [
        DjangoFilterBackend,
        filters.OrderingFilter,
        filters.SearchFilter
    ]
    filterset_class = CarFilter

    search_fields = ['car_model__brand__name', 'car_model__name', 'description']
    ordering_fields = ['price', 'year', 'mileage']
    ordering = ['-created_at']

    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_update(self, serializer):
        instance = serializer.save()
        self._handle_images(instance)

    def _handle_images(self, instance):
        new_images = self.request.FILES.getlist('new_images')
        for image in new_images:
            CarImage.objects.create(car=instance, image=image)

    @action(detail=True, methods=['post'], url_path='delete-image')
    def delete_image(self, request, pk=None):
        image_id = request.data.get('image_id')
        try:
            image = CarImage.objects.get(id=image_id, car__id=pk)
            image.delete()
            return Response({'status': 'photo deleted'}, status=200)
        except CarImage.DoesNotExist:
            return Response({'error': 'Photo not found'}, status=404)


# Остальные классы оставляем без изменений
class BrandViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer


class CarModelViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CarModel.objects.all()
    serializer_class = CarModelSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['brand']


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer