//
//  CNMCogNamerPacket.h
//  CogNamer
//
//  Created by Krisztian Gyuris on 30/09/14.
//  Copyright (c) 2014 Cognex Corporation. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "CNMCogNamerNode.h"
#import "CNMCogNamerRecord.h"

typedef NS_ENUM(NSInteger, CNMCommandTypes)
{
	kCNMCommandTypeNoop = 0,
	kCNMCommandTypeHello = 1,
    kCNMCommandTypeIdentify = 2,
	kCNMCommandTypeBootup = 3,
	kCNMCommandTypeIPAssign = 4,
	kCNMCommandTypeFactoryReset = 5,
	kCNMCommandTypeSetAttribute = 6,
	kCNMCommandTypeFlash = 7,
	kCNMCommandTypeQueryCache = 8,
	kCNMCommandTypeRestart = 9,
    kCNMCommandTypeGetAttribute = 10,
    kCNMCommandTypeResetPassword = 11
};

typedef NS_ENUM(NSInteger, CNMErrorCodes)
{
    kCNMErrorCodeSuccess = 0,
    kCNMErrorCodeFiled = 1,
    kCNMErrorCodeUnsupported = 2,
    kCNMErrorCodeInvalidUsername = 3,
    kCNMErrorCodeInvalidPassword = 4,
    kCNMErrorCodeNoPermissions = 5,
    kCNMErrorCodeMissingInputData = 6,
    kCNMErrorCodeInvalidInputData = 7,
    kCNMErrorCodeCommandOnlySupportedAtBootup = 8,
    kCNMErrorCodeNonExistentRecord = 9
};

typedef NS_ENUM(NSInteger, CNMFlagTypes)
{
    kCNMFlagTypeNone = 0x00,
    kCNMFlagTypeResponse = 0x80,
    kCNMFlagTypeBroadcast = 0x40,
    kCNMFlagTypeSupportedProbe = 0x20,
    kCNMFlagTypeUnsupportedMask = ~(kCNMFlagTypeResponse | kCNMFlagTypeBroadcast | kCNMFlagTypeSupportedProbe)
};

@interface CNMCogNamerPacket : CNMCogNamerNode

@property CNMFlagTypes flags;
@property CNMCommandTypes command;
@property CNMErrorCodes error;
@property int length;
@property (readonly) NSArray *records;

+ (instancetype)readFromStream:(NSInputStream *)input;
+ (instancetype)readFromData:(NSData *)data;
- (void)addRecord:(CNMCogNamerRecord *)record;
- (NSData *)createPacketBuffer;

- (NSData*)macAddress;

@end
