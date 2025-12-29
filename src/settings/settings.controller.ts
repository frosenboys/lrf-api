import { Controller, Get, Body, Patch, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AtGuard } from 'src/auth/at.guard';
import { Roles } from 'src/auth/roles.decorator';
import { AdminRole } from '@prisma/client';
import { RolesGuard } from 'src/auth/roles.guard';

@ApiTags('System Settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) { }

  @Get()
  @ApiOperation({ summary: 'Get system setting (Public)' })
  findOne() {
    return this.settingsService.getSettings();
  }

  @Patch()
  @ApiBearerAuth()
  @UseGuards(AtGuard, RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update system setting (Super Admin)' })
  update(@Body() updateSettingDto: UpdateSettingDto) {
    return this.settingsService.update(updateSettingDto);
  }
}