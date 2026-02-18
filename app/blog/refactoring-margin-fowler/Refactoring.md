# Refactoring — Your Coach's Guide

> *A chat-style guide to Martin Fowler's "Refactoring: Improving the Design of Existing Code" (2nd ed.) — your path to world-class refactoring.*

---

## How to Use This Guide

**Status toggles** at the top of each chapter: change `Not Read` → `Read` and `Not Implemented` → `Implemented` as you progress.

**My Notes** — Write your experience when you try each practice. What worked? What was tricky? What would you do differently?

---

# Chapter 1: Refactoring — A First Example

**Read:** Not Read | **Implemented:** Not Implemented

*Coach says: This chapter walks through a real refactoring session so you can feel the rhythm. Don't skip it — the example teaches you the mindset.*

## Actionable Points

### DO
1. **Start every refactoring with tests.** Before you change a single line, ensure you have a solid, self-checking test suite for that code.
2. **Make small changes and test after each one.** Compile → test → commit. This tight feedback loop is the core of safe refactoring.
3. **Refactor first when adding a feature.** If the code isn't structured to accept the change easily, refactor first, then add the feature.
4. **Extract functions that reveal intent.** If you have to figure out what a chunk does, extract it and name it after what it does.
5. **Remove temporary variables before extraction.** They complicate extractions; use Replace Temp with Query when you can.
6. **Commit after each successful refactor.** So you can always revert to a working state if things go wrong.
7. **Don't worry about trivial performance costs.** Recomputing a value or looping twice is usually negligible; clarity comes first.

### DON'T
8. **Don't copy-and-paste to add variations.** (e.g. HTML vs plain statement). Duplication is a menace for long-lived code.
9. **Don't refactor without tests.** You're flying blind — the book calls this "cowboy refactoring."
10. **Don't take large steps.** If you can't see a bug immediately, revert and take smaller steps.

## My Notes
*(Your experience when implementing these points)*


---

# Chapter 2: Principles in Refactoring

**Read:** Not Read | **Implemented:** Not Implemented

*Coach says: Here you learn what refactoring really means and when it's appropriate. The definition matters.*

## Actionable Points

### DO
1. **Keep behavior unchanged when refactoring.** Refactoring changes structure, not behavior. If behavior changes, it's a bug or a feature.
2. **Refactor when you need to add a feature or fix a bug.** That's when messy code hurts the most. Don't refactor for its own sake on stable, rarely-touched code.
3. **Use the "Rule of Three."** First time: write it. Second time: wince. Third time: refactor. Let the duplication reveal itself before acting.
4. **Separate refactoring commits from feature commits.** Makes code review and rollback much easier.
5. **Improve design in small steps.** Each refactoring is tiny; together they compound.
6. **Define "done" for refactoring.** Stop when the design is good enough for the change at hand — don't over-engineer.

### DON'T
7. **Don't mix refactoring with behavior changes.** One commit = refactor only, or feature only. Never both.
8. **Don't refactor code you're not about to change.** YAGNI applies — you might never need that flexibility.
9. **Don't let "no time" become an excuse.** Crunch often comes from messy code; refactoring saves time in the long run.
10. **Don't skip the definition.** "Refactoring" = behavior-preserving transformation. If you say you're refactoring but behavior changes, you're doing something else.

## My Notes
*(Your experience when implementing these points)*


---

# Chapter 3: Bad Smells in Code

**Read:** Not Read | **Implemented:** Not Implemented

*Coach says: "If it stinks, change it." This chapter gives you the vocabulary to spot problems.*

## Actionable Points

### DO
1. **Learn the smell names:** Long Function, Long Parameter List, Duplicated Code, Feature Envy, Data Clumps, Primitive Obsession, Switch Statements, etc.
2. **Treat smells as hints, not rules.** They suggest where to look; you decide whether and how to act.
3. **Fix smells in the area you're working.** When you touch code, clean up the smells you encounter.
4. **Use comments as extraction hints.** A comment often suggests a function name.
5. **Watch for Feature Envy.** When a function is more interested in another module's data than its own, consider moving behavior.
6. **Use Data Clumps.** If the same group of data appears together often, consider a parameter object or a new abstraction.
7. **Replace Switch Statements** with polymorphism or lookup tables when they grow.

### DON'T
8. **Don't try to fix every smell at once.** Prioritize by impact and by what you're changing.
9. **Don't assume all "smells" are bad.** Sometimes a long function is fine; sometimes duplication is intentional. Use judgment.
10. **Don't ignore Message Chains.** `a.getB().getC().getD()` suggests poor encapsulation — consider hiding internals.

## My Notes
*(Your experience when implementing these points)*


---

# Chapter 4: Building Tests

**Read:** Not Read | **Implemented:** Not Implemented

*Coach says: Tests are not optional for refactoring. This chapter teaches you how to get them.*

## Actionable Points

### DO
1. **Make tests self-checking.** They should pass/fail without manual inspection. No hand-checking output.
2. **Respond to a bug by writing a failing test first.** Reproduce the bug in a test, then fix it. The test stays as a regression guard.
3. **Use a testing framework** (Jest, pytest, etc.) so you can run tests with a single command.
4. **Focus on "Would a defect be caught?"** Subjective but useful — if a change would break behavior, a test should fail.
5. **Refactor tests too.** Tests are code; keep them clear and maintainable.
6. **Use characterization tests for legacy code.** Capture current behavior, then refactor with confidence.

### DON'T
7. **Don't rely on test coverage alone.** Coverage shows what's executed, not how well it's tested.
8. **Don't skip tests because "there's no time."** You'll spend more time debugging later.
9. **Don't over-test.** If you spend more time changing tests than code, you may have too many brittle tests. But under-testing is far more common.
10. **Don't test through the UI if you can avoid it.** Unit tests are faster and more precise for refactoring support.

## My Notes
*(Your experience when implementing these points)*


---

# Chapter 5: Introducing the Catalog

**Read:** Not Read | **Implemented:** Not Implemented

*Coach says: The catalog is a reference. Use it when you know what smell you're addressing but need the mechanics.*

## Actionable Points

### DO
1. **Learn the catalog format:** Name, Sketch, Motivation, Mechanics, Examples. Use it as a checklist.
2. **Take small steps.** The mechanics describe the safest path; take smaller steps if you hit trouble.
3. **Revert to last green if a test fails.** Don't debug a big change — back up and take smaller steps.
4. **Use the sketch and name** to quickly find the refactoring you need.
5. **Read the motivation** to know when NOT to apply a refactoring — every refactoring has contraindications.
6. **Treat the catalog as a vocabulary.** Knowing "Extract Function" vs "Inline Function" helps you communicate and think clearly.

### DON'T
7. **Don't memorize every step.** Reference the mechanics when needed.
8. **Don't assume the catalog is complete.** There are refactorings not in the book; the principles still apply.
9. **Don't skip the "mechanics" when you're stuck.** They often cover edge cases you missed.

## My Notes
*(Your experience when implementing these points)*


---

# Chapter 6: A First Set of Refactorings

**Read:** Not Read | **Implemented:** Not Implemented

*Coach says: Extract Function and Extract Variable are your bread and butter. Master these first.*

## Actionable Points

### DO
1. **Extract Function when intent differs from implementation.** If you have to think to understand a block, extract it and name it.
2. **Name functions by what they do, not how.** `amountFor(aPerformance)` not `calculateAmountFromPlayType`.
3. **Extract Variable for complex expressions.** Name the sub-expression to clarify intent.
4. **Use Inline Function** when the body is as clear as the name, or when you're about to re-extract differently.
5. **Use Change Function Declaration** to rename or add/remove parameters — do it in small steps.
6. **Combine Functions into Class** when several functions operate on shared data. Combines data + behavior.
7. **Use Split Phase** when a function does two distinct things (e.g. parse then render). Split into phases.

### DON'T
8. **Don't extract when too many locals are assigned.** Use Split Variable or Replace Temp with Query first to simplify.
9. **Don't hesitate to extract single-line functions** if the name improves readability. Size isn't the point — intent is.
10. **Don't inline polymorphic methods.** If subclasses override it, you can't inline.

## My Notes
*(Your experience when implementing these points)*


---

# Chapter 7: Encapsulation

**Read:** Not Read | **Implemented:** Not Implemented

*Coach says: Hide your data. Encapsulation reduces coupling and makes change safer.*

## Actionable Points

### DO
1. **Encapsulate records** (plain objects) with getters/setters so you can change structure later.
2. **Encapsulate collections** — don't expose raw arrays; return copies or wrapped accessors.
3. **Replace Primitive with Object** when a primitive has behavior or multiple attributes (e.g. a "price" with currency).
4. **Use Encapsulate Variable** for module-level or object data. Access only through getters/setters.
5. **Hide the representation.** Callers shouldn't know if you store cents or dollars, or which fields exist.
6. **Replace Temp with Query** to remove temporary variables that complicate extraction.

### DON'T
7. **Don't expose mutable collections directly.** `return items` allows callers to mutate; return a copy or a read-only view.
8. **Don't encapsulate "for performance" without measuring.** Usually the cost is negligible.
9. **Don't break encapsulation "just this once."** One leak leads to many.

## My Notes
*(Your experience when implementing these points)*


---

# Chapter 8: Moving Features

**Read:** Not Read | **Implemented:** Not Implemented

*Coach says: Code often lives in the wrong place. Moving it is a core refactoring skill.*

## Actionable Points

### DO
1. **Use Move Function** when a function is used more by another module than its current home.
2. **Use Move Field** when a field is used more by another class. Move the data and the behavior that uses it.
3. **Slide Statements** to gather related code before extracting or moving.
4. **Use Move Statements into Function** to pull call-site logic into the called function when it belongs there.
5. **Use Move Statements to Callers** when the callee has logic that only some callers need.
6. **Split Loop** when one loop does two things — makes extraction and moving easier.

### DON'T
7. **Don't move without updating callers.** Use find-all-references and update each call site.
8. **Don't move in one giant step.** Move, test, then move again if needed.
9. **Don't leave orphaned helpers** — if you move a function, move or inline its close helpers too.

## My Notes
*(Your experience when implementing these points)*


---

# Chapter 9: Organizing Data

**Read:** Not Read | **Implemented:** Not Implemented

*Coach says: Data structures drive complexity. Organize them well.*

## Actionable Points

### DO
1. **Split Variable** when one variable is used for two different things. Give each a clear name.
2. **Rename Variable** liberally. Good names reduce cognitive load.
3. **Replace Derived Variable with Query** when you're maintaining a value that can be computed.
4. **Encapsulate Record** and **Encapsulate Collection** — see Chapter 7.
5. **Replace Magic Literal with Named Constant.** `const TAX_RATE = 0.08` beats `0.08` in five places.
6. **Change Reference to Value** for small, immutable data. Simplifies reasoning.

### DON'T
7. **Don't use one variable for multiple roles.** Split it and name each use.
8. **Don't keep derived data in sync manually** if a query is cheap. Duplicated state causes bugs.
9. **Don't expose raw data structures** when encapsulation would hide future changes.

## My Notes
*(Your experience when implementing these points)*


---

# Chapter 10: Simplifying Conditional Logic

**Read:** Not Read | **Implemented:** Not Implemented

*Coach says: Conditionals are where bugs hide. Simplify them.*

## Actionable Points

### DO
1. **Decompose Conditional** — extract the condition, then-branch, and else-branch into named functions.
2. **Consolidate Conditional Expression** when multiple conditions lead to the same result.
3. **Replace Nested Conditional with Guard Clauses.** Early returns reduce nesting and clarify flow.
4. **Replace Conditional with Polymorphism** when behavior varies by type — move logic into subtypes.
5. **Introduce Null Object** or **Introduce Assertion** to eliminate null checks when appropriate.
6. **Use Extract Function** on condition branches to name complex logic.

### DON'T
7. **Don't nest conditionals** when guard clauses would flatten the logic.
8. **Don't use polymorphism for simple conditionals.** A switch or if/else is fine for 2–3 cases.
9. **Don't leave "mystery" conditions.** Extract and name them so intent is clear.

## My Notes
*(Your experience when implementing these points)*


---

# Chapter 11: Refactoring APIs

**Read:** Not Read | **Implemented:** Not Implemented

*Coach says: APIs are the joints between modules. Clean APIs make everything easier.*

## Actionable Points

### DO
1. **Separate Query from Modifier** when a function both returns data and changes state. Split into two.
2. **Parameterize Function** when two functions differ only by a literal — add a parameter.
3. **Remove Flag Argument** when a boolean parameter switches behavior. Use explicit function names instead.
4. **Preserve Whole Object** instead of passing multiple values — pass the object.
5. **Replace Parameter with Query** (or inverse) based on which module should own the knowledge.
6. **Introduce Parameter Object** when you have a clump of parameters that travel together.

### DON'T
7. **Don't combine queries and modifiers.** Callers expect one or the other; mixing causes surprises.
8. **Don't add parameters "just in case."** Add when you have a real need.
9. **Don't change public APIs without a deprecation path.** Use wrappers or versioning for external consumers.

## My Notes
*(Your experience when implementing these points)*


---

# Chapter 12: Dealing with Inheritance

**Read:** Not Read | **Implemented:** Not Implemented

*Coach says: Inheritance is powerful and easy to misuse. Refactor it carefully.*

## Actionable Points

### DO
1. **Pull Up Method/Field** when subclasses share behavior or data. Move to superclass.
2. **Push Down Method/Field** when a superclass member is only used by one subclass.
3. **Replace Type Code with Subclasses** when type affects behavior. Use polymorphism.
4. **Replace Subclass with Delegate** when inheritance feels wrong — composition can be clearer.
5. **Replace Superclass with Delegate** to break inheritance when the relationship is forced.
6. **Use Extract Superclass** when two classes share significant behavior.
7. **Collapse Hierarchy** when a subclass adds nothing meaningful.

### DON'T
8. **Don't use inheritance for code reuse alone.** Prefer composition if there's no clear "is-a" relationship.
9. **Don't leave empty subclasses** — push down or collapse.
10. **Don't refactor inheritance without tests.** The coupling is subtle; behavior can break in non-obvious ways.

## My Notes
*(Your experience when implementing these points)*


---

## Final Coach Note

Refactoring is a skill you build over time. Start with small steps, lean on tests, and use the catalog when you're stuck. The best refactorers aren't the ones who know every refactoring — they're the ones who take small steps, test often, and aren't afraid to revert.

*— Your refactoring coach*
