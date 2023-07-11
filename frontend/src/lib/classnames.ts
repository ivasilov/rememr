import classnames from 'classnames';
import { twMerge } from 'tailwind-merge';

export const classNames = (...classes: classnames.ArgumentArray) => twMerge(classnames(classes));
