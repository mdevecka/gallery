import { Controller, Body, Post, Param, Get } from "@nestjs/common";
import { swapCreator } from "./swap.service";
import { SwapDto } from "./dto/SwapDto";

@Controller()
export class SwapController {
  constructor(private readonly appService: swapCreator) {}

  @Post("transfer/collection/:collection/asset/:asset")
  getSwap(
    @Body() swapDto: SwapDto,
    @Param("collection") collection: number,
    @Param("asset") asset: number,
  ) {
    return this.appService.createSwapCall(collection, asset, swapDto);
  }

  @Get("pay/:address")
  getPay(@Param("address") address: string) {
    return this.appService.getPayCall(address);
  }
}
