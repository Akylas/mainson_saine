#import "UIView+Dispatcher.h"
#import "JRSwizzle.h"
#import <objc/runtime.h>

static NSString *const kDispatcherView = @"kDispatcherView";

static BOOL kUIViewDispatcherSwizzled = false;

@implementation UIView (Dispatcher)

+ (void)swizzle
{
  if (kUIViewDispatcherSwizzled) {
    return;
  }
  kUIViewDispatcherSwizzled = true;
  [UIView jr_swizzleMethod:@selector(hitTest:withEvent:) withMethod:@selector(hitTestCustom:withEvent:) error:nil];
}

- (void)setDispatcherView:(UIView *)view
{
  [UIView swizzle];
  objc_setAssociatedObject(self, &kDispatcherView, view, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

- (UIView *)dispatcherView
{
  return objc_getAssociatedObject(self, &kDispatcherView);
}
- (UIView *)hitTestCustom:(CGPoint)point withEvent:(UIEvent *)event
{
    UIView *dispatcherView = self.dispatcherView;
    if (dispatcherView) {
        return [dispatcherView hitTest:point withEvent:event];
    }
    //WARNING: this is the swizzle trick, will actually call [UIView hitTest:]
    return [self hitTestCustom:point withEvent:event];
}
@end
