//
//  CNMIPAssignPacket.h
//  CogNamer
//
//  Created by Krisztian Gyuris on 26/09/14.
//  Copyright (c) 2014 Cognex Corporation. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "CNMCogNamerPacket.h"

@interface CNMIPAssignPacket : CNMCogNamerPacket

- (id)initWithHostName:(NSString *)hostName
              username:(NSString *)username
              password:(NSString *)password
            macAddress:(NSData*)macAddress
               useDHCP:(BOOL)useDHCP
             ipAddress:(NSString *)ipAddress
            subNetMask:(NSString *)subNetMask
               gateway:(NSString *)gateway
                   dns:(NSString *)dns
            domainName:(NSString *)domainName;

@end
