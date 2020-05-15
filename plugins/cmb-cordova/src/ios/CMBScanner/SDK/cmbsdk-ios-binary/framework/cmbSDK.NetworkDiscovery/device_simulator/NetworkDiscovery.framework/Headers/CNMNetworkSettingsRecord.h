//
//  CNMNetworkSettingsRecord.h
//  CogNamer
//
//  Created by Krisztian Gyuris on 26/09/14.
//  Copyright (c) 2014 Cognex Corporation. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "CNMCogNamerRecord.h"

@interface CNMNetworkSettings : NSObject

@property (nonatomic) BOOL isDHCPBased;
@property (nonatomic) BOOL isLinkLocalIp;
@property (nonatomic) NSString *subNetMask;
@property (nonatomic) NSString *gateway;
@property (nonatomic) NSString *dnsServer;
@property (nonatomic) NSString *domain;

- (NSData *)networkSettingsAsData;
+ (instancetype)settingsWithData:(NSData *)data;
@end

@interface CNMNetworkSettingsRecord : CNMCogNamerRecord

@property (nonatomic) CNMNetworkSettings *settings;

@end
