//
//  CNMMACAddressRecord.h
//  CogNamer
//
//  Created by Krisztian Gyuris on 26/09/14.
//  Copyright (c) 2014 Cognex Corporation. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "CNMCogNamerRecord.h"

@interface CNMMacAddressRecord : CNMCogNamerRecord

@property (nonatomic, readonly)NSString *macAddressFormatted;
@end
