using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace BE.Model
{
    public class Product_Attribute
    {
        [Key]
        public int AttributeId { get; set; }
        public int ProductId { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string Value { get; set; }

        [ForeignKey("ProductId")]
        public Product Product { get; set; }
    }
}