import { Request, Response, All, Controller, Next, Get, Post } from "@nestjs/common";
import { createBullBoard } from "@bull-board/api";
import { BaseAdapter } from "@bull-board/api/dist/src/queueAdapters/base";
import { ExpressAdapter } from "@bull-board/express";
import express from 'express';
import { ApiExcludeController } from "@nestjs/swagger";

import { getBullBoardQueues } from "./bull-board.queue";
import { Public } from "../config/public-endpoint.config";
import { BullBoardAccessService } from "./bull-board-acess.service";


@Controller('/queues')
@ApiExcludeController()
export class BullBoardController {

    constructor(
        private readonly bullBoardAccessService: BullBoardAccessService,
    ) { }

    @Get('*')
    @Public()
    async acessDashboard(
        @Request() req: express.Request,
        @Response() res: express.Response,
        @Next() next: express.NextFunction,
    ) {

        if (!(req.url.includes('api') || req.url.includes('static'))) {
            const { authorization } = req.query as any;
            await this.bullBoardAccessService.validate(authorization);
        }

        const serverAdapter = new ExpressAdapter();
        serverAdapter.setBasePath('/queues');
        const queues = getBullBoardQueues();
        const router = serverAdapter.getRouter() as express.Express;
        const { addQueue } = createBullBoard({
            queues: [],
            serverAdapter,
        });
        queues.forEach((queue: BaseAdapter) => {
            addQueue(queue);
        });
        const entryPointPath = `/queues/`;
        req.url = req.url.replace(entryPointPath, `/`);
        req.method = 'GET';
        router(req, res, next);
    }
}