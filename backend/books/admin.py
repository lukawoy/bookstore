from django.contrib import admin

from .models import Author, AuthorBook, Book, Review, ShoppingList


class AuthorInline(admin.TabularInline):
    model = AuthorBook
    extra = 1


class BookAdmin(admin.ModelAdmin):
    search_fields = ("title", "author__last_name")
    inlines = (AuthorInline,)
    filter_horizontal = ("favorites",)


class ReviewAdmin(admin.ModelAdmin):
    search_fields = ("text",)
    list_select_related = ("book", "author_review")
    raw_id_fields = ["author_review", "book"]


class ShoppingListAdmin(admin.ModelAdmin):
    search_fields = ("user__last_name", "user__email")
    filter_horizontal = ("book",)


class AuthorAdmin(admin.ModelAdmin):
    search_fields = ("last_name",)


admin.site.register(Book, BookAdmin)
admin.site.register(ShoppingList, ShoppingListAdmin)
admin.site.register(Review, ReviewAdmin)
admin.site.register(Author, AuthorAdmin)
