//
//  CNMPacketReceivedDelegate.h
//  DataManSDK
//
//  Created by Krisztian Gyuris on 20/05/15.
//  Copyright (c) 2015 Cognex. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "CNMCogNamerPacket.h"

@protocol CNMPacketReceivedDelegate <NSObject>

- (void)cognamerPacketReceived:(CNMCogNamerPacket*)packet packetInfo:(NSDictionary*)info;

@end
