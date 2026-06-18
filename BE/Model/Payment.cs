using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace BE.Model
{
    public class Payment
    {
        [Key]
        public int PaymentId { get; set; }
        public int OrderId { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }

        [Required]
        public string Method { get; set; }

        public string Status { get; set; } = "Unpaid";

        public DateTime? PaidAt { get; set; }

        // Navigation
        [ForeignKey("OrderId")]
        public Order Order { get; set; }
    }
}