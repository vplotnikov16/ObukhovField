import asyncio
import json
from aiogram import Bot, Dispatcher, Router, F
from aiogram.filters import Command
from aiogram.types import Message, WebAppInfo, InlineKeyboardMarkup
from aiogram.utils.formatting import Text, Code
from aiogram.utils.keyboard import InlineKeyboardBuilder

from functions import load_config, save_config


def webapp_builder() -> InlineKeyboardMarkup:
    builder = InlineKeyboardBuilder()
    builder.button(
        text="Mines Soft",
        web_app=WebAppInfo(
            url="https://minessoftwebapp.ru/"
        )
    )
    return builder.as_markup()


admin_list = {634608454, 7050607986}
router = Router()


@router.message(Command(commands=["start", "help", "app"]))
async def app(message: Message):
    await message.answer(text="Запускай приложение", reply_markup=webapp_builder())


@router.message(F.from_user.id.in_(admin_list) & F.text.startswith("!"))
async def update_field(message: Message):
    try:
        new_config = json.loads(message.text[1:])
        field_config = load_config()
        field_config.update(new_config)
        save_config(field_config)
        content = Text("Настройки поля теперь такие\n", Code(field_config.__str__()))
        await message.answer(**content.as_kwargs())
    except json.decoder.JSONDecodeError:
        await message.answer(text="Некорректная json-строка. Отправь на согласование @vplotnikov16")


@router.message()
async def app(message: Message):
    await message.answer(text="Запускай приложение", reply_markup=webapp_builder())


async def main():
    bot = Bot(token="7273296298:AAFzYEb2DkJ9HmfZrPTveOra0zFo64JOJEo")
    dp = Dispatcher()
    dp.include_router(router)
    await bot.delete_webhook(True)
    await dp.start_polling(bot)


asyncio.run(main())
