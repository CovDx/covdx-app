//
//  CNMCogNamerRecord.h
//  CogNamer
//
//  Created by Krisztian Gyuris on 26/09/14.
//  Copyright (c) 2014 Cognex Corporation. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "CNMCogNamerNode.h"
typedef NS_ENUM(NSInteger, CNMRecordType)
{
	kCNMRecordTypeNone = 0,
	kCNMRecordTypeKnownSystems = 1,
	kCNMRecordTypeCredentials = 2,
	kCNMRecordTypeDeviceType = 32,
	kCNMRecordTypeMACAddress = 33,
	kCNMRecordTypeHostName = 34,
	kCNMRecordTypeIPAddress = 35,
	kCNMRecordTypeNetworkSettings = 36,
	kCNMRecordTypeModelNumber = 37,
	kCNMRecordTypeSerialNumber = 38,
	kCNMRecordTypeFirmwareVersion = 39,
	kCNMRecordTypeDescription = 40,
	kCNMRecordTypeGroupName = 41,
	kCNMRecordTypeOrderingNumber = 42,
	kCNMRecordTypeServices = 43,
	kCNMRecordTypeLanguageID = 44,
	kCNMRecordTypeComments = 45,
};

@interface CNMCogNamerRecord : CNMCogNamerNode

@property CNMRecordType type;
@property NSData* data;
@property (nonatomic) int length;

+ (CNMCogNamerRecord *)readFromStream:(NSInputStream *)input;

- (NSData *)createPacketBuffer;

@end
