import {
    Controller,
    Get,
    Query,
    Post,
    Body,
    Put,
    Delete,
} from '@nestjs/common';
import { FirebaseService } from './firebase.service';

@Controller('firebase')
export class FirebaseController {
    constructor(private readonly firebaseService: FirebaseService) {}

    @Get('getData')
    async getData(@Query('collection') collection: string) {
        return this.firebaseService.getData(collection);
    }

    @Post('addData')
    async addData(@Query('collection') collection: string, @Body() data: any) {
        return this.firebaseService.addData(collection, data);
    }

    @Put('updateData')
    async updateData(
        @Query('collection') collection: string,
        @Query('uniqueId') uniqueId: string,
        @Body() data: any
    ) {
        return this.firebaseService.updateData(collection, uniqueId, data);
    }

    @Delete('deleteData')
    async deleteData(
        @Query('collection') collection: string,
        @Query('uniqueId') uniqueId: string
    ) {
        return this.firebaseService.deleteData(collection, uniqueId);
    }
}
