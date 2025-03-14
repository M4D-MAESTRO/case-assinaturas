
import { Module, forwardRef } from '@nestjs/common';
import { CaslAbilityFactory } from './casl-ability.factory';
import { SharedModule } from './../../modules/shared.module';

@Module({
  imports: [
    forwardRef(() => SharedModule),
  ],
  providers: [CaslAbilityFactory],
  exports: [CaslAbilityFactory],
})
export class CaslModule { }