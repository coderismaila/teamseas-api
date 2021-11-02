import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { DonationCreateInput } from 'src/@generated/prisma-nestjs-graphql/donation/donation-create.input';
import { OrderByParams } from 'src/graphql';
import { DonationsService } from './donations.service';

const pubSub = new PubSub();

@Resolver('Donation')
export class DonationsResolver {
  constructor(private readonly donationsService: DonationsService) {}

  @Mutation('createDonation')
  async create(
    @Args('createDonationInput')
    createDonationInput: DonationCreateInput,
  ) {
    const donation = await this.donationsService.create(createDonationInput);

    const total = await this.donationsService.getTotal();

    pubSub.publish('totalUpdated', { totalUpdated: { total } });

    return donation;
  }

  @Subscription()
  totalUpdated() {
    return pubSub.asyncIterator('totalUpdated');
  }

  @Query('donations')
  async findAll(@Args('orderBy') orderBy?: OrderByParams) {
    return this.donationsService.findAll(orderBy);
  }

  @Query('donation')
  findOne(@Args('id') id: number) {
    return this.donationsService.findOne({ id });
  }

  @Query('totalDonations')
  totalDonation() {
    return this.donationsService.getTotal();
  }
}
