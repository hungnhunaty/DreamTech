using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace BE.Model
{
    public class Coupon
    {
        [Key]
        public int CouponId { get; set; }

        [Required]
        [MaxLength(50)]
        public string Code { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;


        /// Loại giảm giá: "Percent" hoặc "Fixed"
 
        [Required]
        public string DiscountType { get; set; } = "Percent";


        /// Giá trị giảm: nếu Percent thì 10 = 10%, nếu Fixed thì 50000 = giảm 50k
 
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal DiscountValue { get; set; }


        /// Giá trị đơn hàng tối thiểu để áp dụng coupon
 
        [Column(TypeName = "decimal(18,2)")]
        public decimal MinOrderAmount { get; set; } = 0;


        /// Số tiền giảm tối đa (áp dụng cho loại Percent)
 
        [Column(TypeName = "decimal(18,2)")]
        public decimal? MaxDiscountAmount { get; set; }

        public int UsageLimit { get; set; } = 0;
        public int UsedCount { get; set; } = 0;

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public ICollection<Order> Orders { get; set; }
    }
}
