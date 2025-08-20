using System;
using AuctionService.Models;
using MassTransit;
using Microsoft.EntityFrameworkCore;

namespace AuctionService.Data;

public class ApplicationDbContext : DbContext
{


  public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
  {
  }


  public DbSet<Auction> Auctions { get; set; }

// If rabbitMq is down, it will be added to outbox msgs
  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    base.OnModelCreating(modelBuilder);
    modelBuilder.AddInboxStateEntity();
    modelBuilder.AddOutboxMessageEntity();
    modelBuilder.AddOutboxStateEntity();
  }
}
