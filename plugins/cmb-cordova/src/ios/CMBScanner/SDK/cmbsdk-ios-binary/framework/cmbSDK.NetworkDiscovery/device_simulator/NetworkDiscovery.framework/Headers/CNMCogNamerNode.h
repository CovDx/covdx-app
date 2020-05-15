//
//  CNMCogNamerNode.h
//  CogNamerApp
//
//  Created by Krisztian Gyuris on 27/08/14.
//  Copyright (c) 2014 Krisztian Gyuris. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface CNMCogNamerNode : NSObject
+ (UInt8) readU8:(NSInputStream *)input;
+ (UInt16) readU16:(NSInputStream *)input;
+ (UInt32) readU32:(NSInputStream *)input;
+ (UInt64) readU64:(NSData *)input;
+ (int) readVarInt:(NSInputStream *)input;
+ (NSString *)readString:(NSInputStream *)input length:(int)l;
+ (NSData *) makeU8:(UInt8)input;
+ (NSData *) makeU16:(UInt16)input;
+ (NSData *) makeU32:(UInt32)input;
+ (NSData *) makeU64:(UInt64)input;
+ (NSData *) makeVarInt:(UInt32)input;
+ (NSData *) makeString:(NSString *)input;

// IP Address conversion helper
+ (NSString *)addressFromData:(NSData *)data;
+ (NSString *)addressFromStream:(NSInputStream *)input;
+ (NSData *)dataFromAddressString:(NSString *)address;
@end
