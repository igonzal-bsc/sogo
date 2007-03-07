/*
  Copyright (C) 2000-2005 SKYRIX Software AG

  This file is part of OpenGroupware.org.

  OGo is free software; you can redistribute it and/or modify it under
  the terms of the GNU Lesser General Public License as published by the
  Free Software Foundation; either version 2, or (at your option) any
  later version.

  OGo is distributed in the hope that it will be useful, but WITHOUT ANY
  WARRANTY; without even the implied warranty of MERCHANTABILITY or
  FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public
  License for more details.

  You should have received a copy of the GNU Lesser General Public
  License along with OGo; see the file COPYING.  If not, write to the
  Free Software Foundation, 59 Temple Place - Suite 330, Boston, MA
  02111-1307, USA.
*/

#include "UIxComponent+Agenor.h"
#include <SOGo/AgenorUserManager.h>
#include <SOGo/WOContext+Agenor.h>
#include <SOGo/SOGoUser.h>
#include "common.h"

@implementation UIxComponent(Agenor)

- (NSArray *) getICalPersonsFromValue: (NSString *) selectorValue
{
  NSMutableArray *persons;
  NSEnumerator *uids;
  NSString *uid;
  AgenorUserManager *um;

  um = [AgenorUserManager sharedUserManager];

  persons = [NSMutableArray new];
  [persons autorelease];

  if ([selectorValue length] > 0)
    {
      uids = [[selectorValue componentsSeparatedByString: @","]
               objectEnumerator];
      uid = [uids nextObject];
      while (uid)
        {
          [persons addObject: [um iCalPersonWithUid: uid]];
          uid = [uids nextObject];
        }
    }

  return persons;
}

- (NSString *) emailForUser
{
  return [[context activeUser] email];
}

- (NSString *) cnForUser
{
  return [[context activeUser] cn];
}

@end /* UIxComponent(Agenor) */
