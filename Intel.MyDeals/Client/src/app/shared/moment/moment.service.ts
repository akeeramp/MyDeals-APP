import { Injectable } from '@angular/core';
import * as _moment from 'moment-timezone';

@Injectable()
export class MomentService {
    moment = _moment;
}

@Injectable()
export class StaticMomentService {
    static moment = _moment;
}