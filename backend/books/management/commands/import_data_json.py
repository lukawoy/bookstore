import json
import logging
import os
import shutil

from django.conf import settings
from django.core.management import BaseCommand

from books.models import Author, Book

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

os.makedirs(f"{settings.BASE_DIR}/logs", exist_ok=True)
file_handler = logging.FileHandler(
    f"logs/{__name__}.log", mode="w", encoding="utf-8-sig"
)
stream_handler = logging.StreamHandler()
formatter = logging.Formatter("%(name)s %(asctime)s %(levelname)s %(message)s")
file_handler.setFormatter(formatter)
stream_handler.setFormatter(formatter)
logger.addHandler(file_handler)
logger.addHandler(stream_handler)

source_directory_image = f"{settings.BASE_DIR}/inital_data/images"
destination_directory_image = f"{settings.BASE_DIR}/media/books/images"


class Command(BaseCommand):

    def handle(self, *args, **kwargs):
        logger.info("Запись в БД начальных данных.")

        with open(
            f"{settings.BASE_DIR}/inital_data/BooksAndAuthors.json",
            encoding="utf-8-sig",
        ) as file:
            json_data = json.load(file)
        for row in json_data:
            self._writing_data(row)

        self._copying_images()
        logger.info("Запись в БД закончена.")

    def _writing_data(self, row):
        logger.info(f"Запись книги '{row['title']}'")
        current_object, created = Book.objects.get_or_create(
            title=row["title"],
            description=row["description"],
            image=row["image"],
            release_date=row["release_date"],
            price=row["price"],
        )
        logger.info(
            "Запись книги успешна." if created else "Книга уже существует в БД."
        )
        for author in row["authors"]:
            logger.info(f"Запись автора '{author}'")
            current_author, created = Author.objects.get_or_create(
                first_name=author["first_name"],
                last_name=author["last_name"],
                middle_name=author["middle_name"],
            )
            current_object.author.set([current_author])
            logger.info(
                "Запись автора успешна." if created else "Автор уже существует в БД."
            )

    def _copying_images(self):
        logger.info("Копирование изображений книг.")
        os.makedirs(destination_directory_image, exist_ok=True)

        for filename in os.listdir(source_directory_image):
            source_file = os.path.join(source_directory_image, filename)
            destination_file = os.path.join(destination_directory_image, filename)

            if os.path.isfile(source_file):
                shutil.copy(source_file, destination_file)
                logger.info(f"Скопирован файл: {source_file} -> {destination_file}.")
