using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BuckeyeMarketplace.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateOrderPlacementContract : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "TotalAmount",
                table: "Orders",
                newName: "Total");

            migrationBuilder.RenameColumn(
                name: "CreatedAtUtc",
                table: "Orders",
                newName: "ShippingAddress");

            migrationBuilder.AddColumn<string>(
                name: "ConfirmationNumber",
                table: "Orders",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "OrderDate",
                table: "Orders",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateIndex(
                name: "IX_Orders_ConfirmationNumber",
                table: "Orders",
                column: "ConfirmationNumber",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Orders_ConfirmationNumber",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "ConfirmationNumber",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "OrderDate",
                table: "Orders");

            migrationBuilder.RenameColumn(
                name: "Total",
                table: "Orders",
                newName: "TotalAmount");

            migrationBuilder.RenameColumn(
                name: "ShippingAddress",
                table: "Orders",
                newName: "CreatedAtUtc");
        }
    }
}
