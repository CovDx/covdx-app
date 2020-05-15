//
//  CNMRestartPacket.h
//  CogNamer
//
//  Created by Krisztian Gyuris on 26/09/14.
//  Copyright (c) 2014 Cognex Corporation. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "CNMCogNamerPacket.h"

@interface CNMRestartPacket : CNMCogNamerPacket

- (id)initWithMacAddress:(NSData*)macaddress username:(NSString*)username password:(NSString*)password;

@end
