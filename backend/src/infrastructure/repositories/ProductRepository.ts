import { Op } from 'sequelize';
import { Product } from '../../domain/entities/Product';
import { IProductRepository, ProductSearchCriteria, ProductSearchResult } from '../../domain/repositories/IProductRepository';

export class ProductRepository implements IProductRepository {
  async findAll(criteria?: ProductSearchCriteria): Promise<ProductSearchResult> {
    const whereClause: any = {};

    if (criteria?.name) {
      whereClause.Name = {
        [Op.like]: `%${criteria.name}%`
      };
    }

    if (criteria?.productNumber) {
      whereClause.ProductNumber = {
        [Op.like]: `%${criteria.productNumber}%`
      };
    }

    if (criteria?.color) {
      whereClause.Color = {
        [Op.like]: `%${criteria.color}%`
      };
    }

    if (criteria?.productLine) {
      whereClause.ProductLine = {
        [Op.like]: `%${criteria.productLine}%`
      };
    }

    if (criteria?.class) {
      whereClause.Class = {
        [Op.like]: `%${criteria.class}%`
      };
    }

    if (criteria?.style) {
      whereClause.Style = {
        [Op.like]: `%${criteria.style}%`
      };
    }

    if (criteria?.size) {
      whereClause.Size = {
        [Op.like]: `%${criteria.size}%`
      };
    }

    const { count, rows } = await Product.findAndCountAll({
      where: whereClause,
      order: [['Name', 'ASC']]
    });

    return {
      products: rows,
      totalCount: count,
      currentPage: 1,
      totalPages: 1
    };
  }

  async findById(id: number): Promise<Product | null> {
    return await Product.findByPk(id);
  }

  async search(criteria: ProductSearchCriteria): Promise<ProductSearchResult> {
    return this.findAll(criteria);
  }
}
