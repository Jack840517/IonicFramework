import {
  RouteInfo,
  RouteManagerContext,
  StackContext,
  StackContextState,
  ViewItem,
  generateId,
  getConfig,
} from '@ionic/react';
import React from 'react';
import { matchPath } from 'react-router-dom';

import { clonePageElement } from './clonePageElement';

interface StackManagerProps {
  routeInfo: RouteInfo;
}

interface StackManagerState {}

const isViewVisible = (el: HTMLElement) => !el.classList.contains('ion-page-invisible') && !el.classList.contains('ion-page-hidden');

export class StackManager extends React.PureComponent<StackManagerProps, StackManagerState> {
  id: string;
  context!: React.ContextType<typeof RouteManagerContext>;
  ionRouterOutlet?: React.ReactElement;
  routerOutletElement: HTMLIonRouterOutletElement | undefined;

  stackContextValue: StackContextState = {
    registerIonPage: this.registerIonPage.bind(this),
    isInOutlet: () => true,
  };

  private pendingPageTransition = false;

  constructor(props: StackManagerProps) {
    super(props);
    this.registerIonPage = this.registerIonPage.bind(this);
    this.transitionPage = this.transitionPage.bind(this);
    this.handlePageTransition = this.handlePageTransition.bind(this);
    this.id = generateId('routerOutlet');
  }

  componentDidMount() {
    if (this.routerOutletElement) {
      this.setupRouterOutlet(this.routerOutletElement);
      // console.log(`SM Mount - ${this.routerOutletElement.id} (${this.id})`);
      this.handlePageTransition(this.props.routeInfo);
    }
  }

  componentDidUpdate(prevProps: StackManagerProps) {
    if (this.props.routeInfo.pathname !== prevProps.routeInfo.pathname || this.pendingPageTransition) {
      this.handlePageTransition(this.props.routeInfo);
      this.pendingPageTransition = false;
    }
  }

  componentWillUnmount() {
    // console.log(`SM UNMount - ${(this.routerOutletElement?.id as any).id} (${this.id})`);
    this.context.clearOutlet(this.id);
  }

  async handlePageTransition(routeInfo: RouteInfo) {
    if (!this.routerOutletElement || !this.routerOutletElement.commit) {
      /**
       * The route outlet has not mounted yet. We need to wait for it to render
       * before we can transition the page.
       *
       * Set a flag to indicate that we should transition the page after
       * the component has updated.
       */
      this.pendingPageTransition = true;
    } else {
      let enteringViewItem = this.context.findViewItemByRouteInfo(routeInfo, this.id);
      let leavingViewItem = this.context.findLeavingViewItemByRouteInfo(routeInfo, this.id);

      if (!leavingViewItem && routeInfo.prevRouteLastPathname) {
        leavingViewItem = this.context.findViewItemByPathname(
          routeInfo.prevRouteLastPathname,
          this.id
        );
      }

      // Check if leavingViewItem should be unmounted
      if (leavingViewItem) {
        if (routeInfo.routeAction === 'replace') {
          leavingViewItem.mount = false;
        } else if (!(routeInfo.routeAction === 'push' && routeInfo.routeDirection === 'forward')) {
          if (routeInfo.routeDirection !== 'none' && enteringViewItem !== leavingViewItem) {
            leavingViewItem.mount = false;
          }
        } else if (routeInfo.routeOptions?.unmount) {
          leavingViewItem.mount = false;
        }
      }

      const enteringRoute = matchRoute(
        this.ionRouterOutlet?.props.children,
        routeInfo
      ) as React.ReactElement;

      if (enteringViewItem) {
        enteringViewItem.reactElement = enteringRoute;
      } else if (enteringRoute) {
        enteringViewItem = this.context.createViewItem(this.id, enteringRoute, routeInfo);
        this.context.addViewItem(enteringViewItem);
      }

      if (enteringViewItem && enteringViewItem.ionPageElement) {
        /**
         * If the entering view item is the same as the leaving view item,
         * then we don't need to transition.
         */
        if (enteringViewItem === leavingViewItem) {
          /**
           * If the entering view item is the same as the leaving view item,
           * we are either transitioning using parameterized routes to the same view
           * or a parent router outlet is re-rendering as a result of React props changing.
           *
           * If the route data does not match the current path, the parent router outlet
           * is attempting to transition and we cancel the operation.
           */
          if (enteringViewItem.routeData.match.url !== routeInfo.pathname) {
            return;
          }
        }

        /**
         * If there isn't a leaving view item, but the route info indicates
         * that the user has routed from a previous path, then we need
         * to find the leaving view item to transition between.
         */
        if (!leavingViewItem && this.props.routeInfo.prevRouteLastPathname) {
          leavingViewItem = this.context.findViewItemByPathname(this.props.routeInfo.prevRouteLastPathname, this.id);
        }

        /**
         * If the entering view is already visible and the leaving view is not, the transition does not need to occur.
         */
        if (isViewVisible(enteringViewItem.ionPageElement) && leavingViewItem !== undefined && !isViewVisible(leavingViewItem.ionPageElement!)) {
          return;
        }

        /**
         * The view should only be transitioned in the following cases:
         * 1. Performing a replace or pop action, such as a swipe to go back gesture
         * to animation the leaving view off the screen.
         *
         * 2. Navigating between top-level router outlets, such as /page-1 to /page-2;
         * or navigating within a nested outlet, such as /tabs/tab-1 to /tabs/tab-2.
         *
         * 3. The entering view is an ion-router-outlet containing a page
         * matching the current route and that hasn't already transitioned in.
         *
         * This should only happen when navigating directly to a nested router outlet
         * route or on an initial page load (i.e. refreshing). In cases when loading
         * /tabs/tab-1, we need to transition the /tabs page element into the view.
         */
        this.transitionPage(routeInfo, enteringViewItem, leavingViewItem);
      } else if (leavingViewItem && !enteringRoute && !enteringViewItem) {
        // If we have a leavingView but no entering view/route, we are probably leaving to
        // another outlet, so hide this leavingView. We do it in a timeout to give time for a
        // transition to finish.
        // setTimeout(() => {
        if (leavingViewItem.ionPageElement) {
          leavingViewItem.ionPageElement.classList.add('ion-page-hidden');
          leavingViewItem.ionPageElement.setAttribute('aria-hidden', 'true');
        }
        // }, 250);
      }

      this.forceUpdate();
    }
  }

  registerIonPage(page: HTMLElement, routeInfo: RouteInfo) {
    const foundView = this.context.findViewItemByRouteInfo(routeInfo, this.id);
    if (foundView) {
      foundView.ionPageElement = page;
      foundView.ionRoute = true;
    }
    this.handlePageTransition(routeInfo);
  }

  async setupRouterOutlet(routerOutlet: HTMLIonRouterOutletElement) {
    const canStart = () => {
      const config = getConfig();
      const swipeEnabled = config && config.get('swipeBackEnabled', routerOutlet.mode === 'ios');
      if (swipeEnabled) {
        return this.context.canGoBack();
      } else {
        return false;
      }
    };

    const onStart = () => {
      this.context.goBack();
    };
    routerOutlet.swipeHandler = {
      canStart,
      onStart,
      onEnd: (_shouldContinue) => true,
    };
  }

  async transitionPage(
    routeInfo: RouteInfo,
    enteringViewItem: ViewItem,
    leavingViewItem?: ViewItem
  ) {
    const routerOutlet = this.routerOutletElement!;

    const direction =
      routeInfo.routeDirection === 'none' || routeInfo.routeDirection === 'root'
        ? undefined
        : routeInfo.routeDirection;

    if (enteringViewItem && enteringViewItem.ionPageElement && this.routerOutletElement) {
      if (
        leavingViewItem &&
        leavingViewItem.ionPageElement &&
        enteringViewItem === leavingViewItem
      ) {
        // If a page is transitioning to another version of itself
        // we clone it so we can have an animation to show

        const match = matchComponent(leavingViewItem.reactElement, routeInfo.pathname, true);
        if (match) {
          const newLeavingElement = clonePageElement(leavingViewItem.ionPageElement.outerHTML);
          if (newLeavingElement) {
            this.routerOutletElement.appendChild(newLeavingElement);
            await runCommit(enteringViewItem.ionPageElement, newLeavingElement);
            this.routerOutletElement.removeChild(newLeavingElement);
          }
        } else {
          await runCommit(enteringViewItem.ionPageElement, undefined);
        }
      } else {
        await runCommit(enteringViewItem.ionPageElement, leavingViewItem?.ionPageElement);
        if (leavingViewItem && leavingViewItem.ionPageElement) {
          leavingViewItem.ionPageElement.classList.add('ion-page-hidden');
          leavingViewItem.ionPageElement.setAttribute('aria-hidden', 'true');
        }
      }
    }

    async function runCommit(enteringEl: HTMLElement, leavingEl?: HTMLElement) {
      enteringEl.classList.add('ion-page');
      enteringEl.classList.add('ion-page-invisible');

      await routerOutlet.commit(enteringEl, leavingEl, {
        deepWait: true,
        duration: direction === undefined ? 0 : undefined,
        direction: direction as any,
        showGoBack: !!routeInfo.pushedByRoute,
        progressAnimation: false,
        animationBuilder: routeInfo.routeAnimation,
      });
    }
  }

  render() {
    const { children } = this.props;
    const ionRouterOutlet = React.Children.only(children) as React.ReactElement;
    this.ionRouterOutlet = ionRouterOutlet;

    const components = this.context.getChildrenToRender(
      this.id,
      this.ionRouterOutlet,
      this.props.routeInfo,
      () => {
        this.forceUpdate();
      }
    );

    return (
      <StackContext.Provider value={this.stackContextValue}>
        {React.cloneElement(
          ionRouterOutlet as any,
          {
            ref: (node: HTMLIonRouterOutletElement) => {
              if (ionRouterOutlet.props.setRef) {
                ionRouterOutlet.props.setRef(node);
              }
              if (ionRouterOutlet.props.forwardedRef) {
                ionRouterOutlet.props.forwardedRef.current = node;
              }
              this.routerOutletElement = node;
              const { ref } = ionRouterOutlet as any;
              if (typeof ref === 'function') {
                ref(node);
              }
            },
          },
          components
        )}
      </StackContext.Provider>
    );
  }

  static get contextType() {
    return RouteManagerContext;
  }
}

export default StackManager;

function matchRoute(node: React.ReactNode, routeInfo: RouteInfo) {
  let matchedNode: React.ReactNode;
  React.Children.forEach(node as React.ReactElement, (child: React.ReactElement) => {
    const matchProps = {
      exact: child.props.exact,
      path: child.props.path || child.props.from,
      component: child.props.component,
    };
    const match = matchPath(routeInfo.pathname, matchProps);
    if (match) {
      matchedNode = child;
    }
  });

  if (matchedNode) {
    return matchedNode;
  }
  // If we haven't found a node
  // try to find one that doesn't have a path or from prop, that will be our not found route
  React.Children.forEach(node as React.ReactElement, (child: React.ReactElement) => {
    if (!(child.props.path || child.props.from)) {
      matchedNode = child;
    }
  });

  return matchedNode;
}

function matchComponent(node: React.ReactElement, pathname: string, forceExact?: boolean) {
  const matchProps = {
    exact: forceExact ? true : node.props.exact,
    path: node.props.path || node.props.from,
    component: node.props.component,
  };
  const match = matchPath(pathname, matchProps);

  return match;
}
