import csv
import shutil
import os
import json

from django.conf import settings
from django.core.management import BaseCommand

from books.models import Book, Author

# Укажите пути к исходной и целевой директории
source_directory = f'{settings.BASE_DIR}/inital_data/images'
destination_directory = f'{settings.BASE_DIR}/media/books/images'

names_data_files = ('Authors.json', 'Books.json')


class Command(BaseCommand):

    def handle(self, *args, **kwargs):
        for name_data_file in names_data_files:
            path_file = f'{settings.BASE_DIR}/inital_data/{name_data_file}'

            with open(path_file) as file:
                json_data = json.load(file)
            for row in json_data:
                self._writing_data(row, name_data_file)
        
        self._copying_images()

    def _writing_data(self, row, name_file):
        if name_file == 'Authors.json':
            current_author, created = Author.objects.get_or_create(
                first_name=row['first_name'],
                last_name=row['last_name'],
                middle_name=row['middle_name'],
            )
            if not created:
                self.stdout.write(self.style.WARNING(f'Запись {current_author} проигнорирована - уже существует в БД.'))
            else:
                self.stdout.write(self.style.SUCCESS(f'{current_author} - запись успешна.'))
            return

        current_book, created = Book.objects.get_or_create(
            title=row['title'],
            description=row['description'],
            image=row['image'],
            release_date=row['release_date'],
            price=row['price'],
        )
        current_book.author.set(Author.objects.filter(id=row['author']))

        if not created:
            self.stdout.write(self.style.WARNING(f'Запись {current_book} проигнорирована - уже существует в БД.'))
        else:
            self.stdout.write(self.style.SUCCESS(f'{current_book} - запись успешна.'))

    def _copying_images(self):
        os.makedirs(destination_directory, exist_ok=True)

        for filename in os.listdir(source_directory):
            source_file = os.path.join(source_directory, filename)
            destination_file = os.path.join(destination_directory, filename)

            if os.path.isfile(source_file):
                shutil.copy(source_file, destination_file)
                self.stdout.write(self.style.SUCCESS(f'Скопирован файл: {source_file} -> {destination_file}'))
