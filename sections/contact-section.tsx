import type { Dictionary } from "@/data/dictionaries";
import type { ContactLink, StudioDossierAsset } from "@/data/profile";
import { assetPath } from "@/lib/site";

import { Reveal } from "@/components/reveal";

interface ContactSectionProps {
  copy: Dictionary["contact"];
  contacts: ContactLink[];
  dossier: StudioDossierAsset;
}

function getRouteValue(item: ContactLink, copy: Dictionary["contact"], dossierAvailable: boolean) {
  if (item.key === "dossier") {
    return dossierAvailable ? copy.dossierActionLabel : copy.dossierUnavailableLabel;
  }

  if (!item.available) {
    return copy.unavailableLabel;
  }

  return item.label;
}

export function ContactSection({ copy, contacts, dossier }: ContactSectionProps) {
  return (
    <section id="contact" className="section-shell archive-chamber-section">
      <div className="space-y-6">
        <Reveal>
          <div className="section-heading-center space-y-5">
            <p className="section-kicker">{copy.eyebrow}</p>
            <h2 className="section-title">{copy.title}</h2>
            <div className="section-ornament" aria-hidden="true" />
            <p className="section-body section-body-centered">{copy.intro}</p>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="signal-frame archive-register">
            <div className="space-y-5 signal-column">
              <div className="space-y-3">
                <p className="section-kicker">{copy.cardTitle}</p>
                <h3 className="font-display text-3xl text-ivory">{copy.cardTitle}</h3>
                <p className="max-w-lg text-sm leading-7 text-mist">{copy.cardBody}</p>
              </div>

              <ul className="signal-route-list">
                {contacts.map((item) => {
                  const routeLabel = item.key === "dossier" ? copy.dossierRouteLabel : item.key;
                  const routeAvailable = item.key === "dossier" ? dossier.available : item.available;
                  const routeHref = item.key === "dossier" ? dossier.href : item.href;
                  const routeValue = getRouteValue(item, copy, dossier.available);

                  return (
                    <li key={item.key}>
                      {routeAvailable ? (
                        <a
                          href={item.key === "dossier" ? assetPath(routeHref) : routeHref}
                          className="signal-route"
                          target={item.key === "dossier" ? undefined : "_blank"}
                          rel={item.key === "dossier" ? undefined : "noreferrer"}
                          download={item.key === "dossier" ? true : undefined}
                        >
                          <span className="signal-route-key">{routeLabel}</span>
                          <span className="signal-route-value">{routeValue}</span>
                        </a>
                      ) : (
                        <div className="signal-route signal-route-disabled" aria-disabled="true">
                          <span className="signal-route-key">{routeLabel}</span>
                          <span className="signal-route-value">{routeValue}</span>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="dossier-folio signal-column">
              <div className="space-y-3">
                <p className="section-kicker">{copy.dossierTitle}</p>
                <h3 className="font-display text-3xl text-ivory">{copy.dossierTitle}</h3>
                <p className="max-w-xl text-sm leading-7 text-mist">{copy.dossierBody}</p>
              </div>

              <div className="dossier-panel">
                <div>
                  <p className="artifact-meta-label">{copy.capabilitiesTitle}</p>
                  <ul className="dossier-listing">
                    {copy.capabilities.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="artifact-meta-label">{copy.collaborationTitle}</p>
                  <p className="mt-2 text-sm leading-7 text-mist">{copy.collaborationBody}</p>
                </div>
              </div>

              {dossier.available ? (
                <a className="primary-button w-fit" href={assetPath(dossier.href)} download>
                  {copy.dossierActionLabel}
                </a>
              ) : (
                <span className="secondary-button w-fit" aria-disabled="true">
                  {copy.dossierUnavailableLabel}
                </span>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
