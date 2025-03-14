import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from '../constants/jwtConstants';
import { DefaultPayloadDto } from '../dto/default-payload.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      signOptions: { expiresIn: '60d' },
      secretOrKey: jwtConstants.secret,
    });
  }
 
  async validate(payload: DefaultPayloadDto) {
    //console.log(payload);
    const { email, perfil_id, avatar, id, nome, perfil_nome } = payload;
    return { email, perfil_id, avatar, id, nome, perfil_nome };
  }
}