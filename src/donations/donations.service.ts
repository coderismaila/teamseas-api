import { Donation, Prisma } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { OrderByParams } from 'src/graphql';

@Injectable()
export class DonationsService {
  constructor(private readonly prisma: PrismaService) {}
  create(createDonationInput: Prisma.DonationCreateInput): Promise<Donation> {
    return this.prisma.donation.create({ data: createDonationInput });
  }

  async findAll(orderBy?: OrderByParams): Promise<Donation[] | null> {
    const { field = 'createdAt', direction = 'desc' } = orderBy || {};
    return this.prisma.donation.findMany({
      orderBy: { [field]: direction },
    });
  }

  findOne(
    donationWhereUniqueInput: Prisma.DonationWhereUniqueInput,
  ): Promise<Donation> | null {
    return this.prisma.donation.findUnique({ where: donationWhereUniqueInput });
  }

  async getTotal() {
    const response = await this.prisma.donation.aggregate({
      _sum: {
        count: true,
      },
    });
    return response._sum.count;
  }
}
