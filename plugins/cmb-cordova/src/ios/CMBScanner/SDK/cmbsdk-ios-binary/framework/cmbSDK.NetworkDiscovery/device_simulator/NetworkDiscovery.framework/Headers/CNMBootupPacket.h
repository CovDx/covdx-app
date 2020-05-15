//
//  CNMBootupPacket.h
//  CogNamer
//
//  Created by Krisztian Gyuris on 26/09/14.
//  Copyright (c) 2014 Cognex Corporation. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "CNMCogNamerPacket.h"
#import "CNMNetworkSettingsRecord.h"
#import "CNMCogNamerDeviceType.h"

@interface CNMBootupPacket : CNMCogNamerPacket

- (id)initWithHostName:(NSString *)hostName
             ipAddress:(NSString *)address
            macAddress:(NSData*)macAddress
       networkSettings:(CNMNetworkSettings *)networkSettings
            deviceType:(CNMCogNamerDeviceType)deviceType
           modelNumber:(NSString *)modelNumber
           description:(NSString *)description
       firmwareVersion:(NSString *)firmwareVersion
          serialNumber:(NSString *)serialNumber
        dmccTelnetPort:(int)dmccTelnetPort
          dmccHttpPort:(int)dmccHttpPort;

@end
