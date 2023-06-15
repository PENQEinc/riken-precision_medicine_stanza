import { createPopper, type Instance, type Options } from "@popperjs/core";
import { Writable, writable } from "svelte/store";

export const isScrolling = writable(false);

export default function createPopperAction(): [
  (element: HTMLElement) => { destroy: () => void },
  (
    element: HTMLElement,
    params: Partial<Options>
  ) => {
    update: (newParams: Partial<Options>) => void;
    destroy: () => void;
  },
  (element: HTMLElement) => { destroy: () => void },
  Writable<boolean>
] {
  let popperTrigger, popperTooltip, popperBackdrop;
  let popperParams: Partial<Options>;
  let popper: Instance | null = null;
  let backdropHover = false;
  const show = writable(false);

  isScrolling.subscribe((value) => {
    if (value) {
      show.set(false);
    }
  });

  function handleBackdropEnter() {
    backdropHover = true;
  }
  function handleBackdropLeave() {
    backdropHover = false;
  }

  function toggleOff() {
    if (!backdropHover) {
      show.set(false);
    }
  }

  function toggleOn() {
    show.set(true);
  }

  function initializePopper() {
    if (popperTrigger && popperTooltip && popperBackdrop) {
      popper = createPopper(popperTrigger, popperTooltip, popperParams);
    }
  }

  function destroyPopper() {
    if (popper) {
      popper?.destroy();
      popper = null;
    }
  }

  function usePopperTrigger(element: HTMLElement) {
    popperTrigger = element;
    popperTrigger.addEventListener("mouseenter", toggleOn);
    popperTrigger.addEventListener("mouseleave", toggleOff);
    initializePopper();
    return {
      destroy() {
        popperTrigger.removeEventListener("mouseenter", toggleOn);
        popperTrigger.removeEventListener("mouseleave", toggleOff);
        popperTrigger = null;
        destroyPopper();
      },
    };
  }

  function usePopperTooltip(element: HTMLElement, params: Partial<Options>) {
    popperTooltip = element;
    popperParams = params;
    initializePopper();
    return {
      update(newParams: Partial<Options>) {
        popperParams = newParams;
        popper.setOptions(popperParams);
      },
      destroy() {
        popperTooltip = null;
        destroyPopper();
      },
    };
  }

  function usePopperBackdrop(element: HTMLElement) {
    popperBackdrop = element;
    popperBackdrop.addEventListener("mouseenter", handleBackdropEnter);
    popperBackdrop.addEventListener("mouseleave", handleBackdropLeave);
    initializePopper();
    return {
      destroy() {
        popperBackdrop.removeEventListener("mouseenter", handleBackdropEnter);
        popperBackdrop.removeEventListener("mouseleave", handleBackdropLeave);
        popperBackdrop = null;
        destroyPopper();
      },
    };
  }

  return [usePopperTrigger, usePopperTooltip, usePopperBackdrop, show];
}
