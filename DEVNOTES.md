# DEVNOTES

These are general develop instructions

## Code Review Checklist

### Functionality

- [ ] Does the code work as expected?

### Hygiene & Readability

- [ ] Is there a dead/commented-out code?
- [ ] Are variable/function names meaningful and unambiguous?
- [ ] Are things names consistently?
- [ ] Are we following the [DRY principle](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)? 
- [ ] Is Code Easily understood?

### Code Design

- [ ] Can Code be simplified further?
- [ ] Does the change we're making affect other parts of the system?
- [ ] Is the code modular as possible?
- [ ] Can we get rid of global variables?

### Optimizations

- [ ] Uses Next.js built-ins (Image, Link, dynamic imports) where appropriate
- [ ] Images optimized with next/image
- [ ] Can code be replaced by standard library function?
- [ ] Can we get rid of dependency?


## PR Submission Checklist

### Before Submitting PR
- [ ] Ensure we have triaged the issue and commented-out the findings on the issue
- [ ] Ensure we have add the issue in project and moved the card according to its status
- [ ] Ensure we've run Prettier
- [ ] Ensure the `npm run build` command has been run
- [ ] Ensure we have added migrations file as well if PR includes models changes.
- [ ] Ensure any merge conflicts are solve for PR
- [ ] Ensure you've referenced PR in Issue via comments
- [ ] If PR includes UI change/Workflow change please include `before` and `after` GIF inside the issue
- [ ] Did we update DEVNOTES.md file for any changes? (E.g. New Feature, Changes to existing workflow)


### After Submitting PR

- [ ] Merge the feature branch to `develop` branch
- [ ] Ensure the `npm run build` command has been run on `develop` branch
- [ ] Ensure the testing is done on `develop` branch

## Backend

1. Once the environment is setup ensure you setup pre-commit correctly `pip3 install pre-commit`
1. With virtualenv activiated do `pre-commit install` from project's root directory
