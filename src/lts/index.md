# Kdu 2 LTS, EOL & Extended Support

## How long will Kdu 2 be supported?

Kdu 2.7 is the current, and final minor release of Kdu 2.x. Kdu 2.7 receives 18 months of LTS (long-term support) starting from its release date on December 10th, 2022. During this period, Kdu 2 will receive necessary bug and security fixes, but will no longer receive new features.

**Kdu 2 will reach End of Life (EOL) on May 10st, 2024**. After that date, Kdu 2 will continue to be available in all existing distribution channels (CDNs and package managers), but will no longer receive updates, including security and browser compatibility fixes.

## Options for dealing with EOL

### Upgrade to Kdu 3

Kdu 3 is the current, latest major version of Kdu. It provides better performance, better TypeScript support, and contains new features that are not present in Kdu 2, such as Teleport, Suspense, and multiple root elements per template.

Kdu 3 contains breaking changes that make it incompatible with Kdu 2, so migration will require a certain level of effort depending on your project.

Despite the breaking changes, the majority of Kdu APIs are shared between the two major versions, so most of your team's Kdu 2 knowledge will continue to work in Kdu 3. In the long run, we also intend to avoid major breaking upgrades like the one between Kdu 2 and Kdu 3. Compatibility and ecosystem stability will be our topmost priority for future releases, and new features will be introduced in a way that does not require major migrations.


### Upgrade or not to Upgrade

Whether you should upgrade to Kdu 3 highly depends on specific project details. Some general guidelines:

1. Understand what you will gain from upgrading.

   Due to 2.7, the DX gap between the two major versions are no longer that prominent - the main benefit of upgrading will be more refined TypeScript support, better performance, and access to the Kdu 3 ecosystem and future new features.

   Ask your team these questions: is the app stable and working well? Does the app expect continued new feature development into the future? Is there a pain-point / bottleneck that can only be solved by upgrading? If the app is stable and isn't experiencing major pain-point caused by Kdu 2, then upgrading may not be worthwhile.

2. Understand the cost of upgrading.

   Does the app rely on 3rd party dependencies that are hard to be made Kdu 3 compatible? Does the app rely heavily on changed behavior between Kdu 2 and Kdu 3? Can the team allocate dedicated time for upgrading? Spend some initial research time to gauge these aspects and come up with an estimation, then compare that to the expected gain from (1). We will not be able to provide a precise formula, but hopefully this can help with the decision process.


### Stay on Kdu 2

Some teams may not be able to upgrade to Kdu 3 by this timeline due to limited bandwidth, budget, risk tolerance, or reliance on Kdu-3-incompatible dependencies. We totally understand this, and want to ensure that staying on Kdu 2 beyond EOL is a viable option.

#### The Technical Perspective

From a technical perspective, Kdu 2 is a stable and battle-tested piece of technology. If it is serving you well now, it will continue to do so for the foreseeable future.

In addition, we have backported some of the most important Kdu 3 features to [Kdu 2.7](/v2/guide/migration-kdu-2-7.html), including Composition API and `<script setup>`. This allows Kdu 2 projects to improve scalability, leverage new ecosystem libraries, and better prepare for potential migration to Kdu 3.

Kdu 2.7 will also be the maintained release before EOL hits, so if you intend to stay on Kdu 2, you should at least upgrade to Kdu 2.7.

#### Security & Compliance

For some teams, the main concern lies in security, compliance, and browser compatibility.

- You won't receive security fixes from EOL software. For the record, Kdu 2 hasn't really had any real vulnerabilities in the past, but you may need a supported version to fullfil regulations or company policies.

- If you are shipping your application to customers with SLAs. You _will_ want to avoid including EOL software in your stack.

- Browsers sometimes ship changes that break legacy libraries. This is extremely rare, but could happen in theory.
