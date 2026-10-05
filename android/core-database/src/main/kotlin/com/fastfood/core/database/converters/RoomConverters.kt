package com.fastfood.core.database.converters

import androidx.room.TypeConverter
import com.fastfood.core.model.money.Money
import com.fastfood.core.model.order.*
import com.fastfood.core.model.stock.StockMovementType
import com.fastfood.core.model.stock.StockUnit

class RoomConverters {

    @TypeConverter
    fun fromMoney(money: Money?): Long? = money?.centimes

    @TypeConverter
    fun toMoney(centimes: Long?): Money? = centimes?.let { Money(it) }

    @TypeConverter
    fun fromOrderType(type: OrderType?): String? = type?.name

    @TypeConverter
    fun toOrderType(value: String?): OrderType? = value?.let { OrderType.valueOf(it) }

    @TypeConverter
    fun fromOrderStatus(status: OrderStatus?): String? = status?.name

    @TypeConverter
    fun toOrderStatus(value: String?): OrderStatus? = value?.let { OrderStatus.valueOf(it) }

    @TypeConverter
    fun fromPaymentMethod(method: PaymentMethod?): String? = method?.name

    @TypeConverter
    fun toPaymentMethod(value: String?): PaymentMethod? = value?.let { PaymentMethod.valueOf(it) }

    @TypeConverter
    fun fromPaymentStatus(status: PaymentStatus?): String? = status?.name

    @TypeConverter
    fun toPaymentStatus(value: String?): PaymentStatus? = value?.let { PaymentStatus.valueOf(it) }

    @TypeConverter
    fun fromSyncStatus(status: SyncStatus?): String? = status?.name

    @TypeConverter
    fun toSyncStatus(value: String?): SyncStatus? = value?.let { SyncStatus.valueOf(it) }

    @TypeConverter
    fun fromStockUnit(unit: StockUnit?): String? = unit?.name

    @TypeConverter
    fun toStockUnit(value: String?): StockUnit? = value?.let { StockUnit.valueOf(it) }

    @TypeConverter
    fun fromStockMovementType(type: StockMovementType?): String? = type?.name

    @TypeConverter
    fun toStockMovementType(value: String?): StockMovementType? = value?.let { StockMovementType.valueOf(it) }

    @TypeConverter
    fun fromUserRole(role: UserRole?): String? = role?.name

    @TypeConverter
    fun toUserRole(value: String?): UserRole? = value?.let { UserRole.valueOf(it) }
}
