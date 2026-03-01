import html2pdf from 'html2pdf.js'
import React from 'react'
import type { User } from '@/types/api'
import { createRoot } from 'react-dom/client'
import { MembershipCertificate } from '@/components/certificate/MembershipCertificate'

/**
 * Generates a PDF certificate for the given user
 * @param user - The user object containing membership information
 * @returns Promise that resolves when PDF is generated and downloaded
 */
export async function generateCertificate(user: User): Promise<void> {
  // Validate required data
  if (!user.member_id) {
    throw new Error('Member ID is required to generate certificate')
  }

  if (!user.name) {
    throw new Error('User name is required to generate certificate')
  }

  // Create a temporary container for the certificate
  const container = document.createElement('div')
  container.style.position = 'absolute'
  container.style.left = '-9999px'
  container.style.top = '-9999px'
  container.style.width = '297mm'
  container.style.height = '210mm'
  document.body.appendChild(container)

  let root: ReturnType<typeof createRoot> | null = null

  try {
    // Render the certificate component
    root = createRoot(container)
    root.render(React.createElement(MembershipCertificate, { user }))

    // Wait for the component to render
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    // Get the certificate element
    const certificateElement = container.querySelector('#membership-certificate')
    if (!certificateElement) {
      throw new Error('Certificate element not found')
    }
    
    // Wait for images to load
    const images = certificateElement.querySelectorAll('img')
    const imagePromises = Array.from(images).map((img) => {
      if (img.complete) return Promise.resolve()
      return new Promise((resolve, reject) => {
        img.onload = () => resolve(undefined)
        img.onerror = reject
        // Timeout after 5 seconds
        setTimeout(() => reject(new Error('Image loading timeout')), 5000)
      })
    })
    
    await Promise.all(imagePromises)

    // Add a style element to preserve colors and ensure compatibility
    const styleElement = document.createElement('style')
    styleElement.textContent = `
      #membership-certificate {
        color: inherit !important;
        background-color: inherit !important;
        border-color: inherit !important;
      }
      #membership-certificate h1,
      #membership-certificate h2,
      #membership-certificate h3 {
        color: rgb(26, 95, 63) !important;
      }
      #membership-certificate p[style*="#1a5f3f"],
      #membership-certificate p[style*="rgb(26, 95, 63)"] {
        color: rgb(26, 95, 63) !important;
      }
    `
    container.appendChild(styleElement)

    // Configure PDF options
    const opt = {
      margin: 0,
      filename: `ESAT-B_Membership_Certificate_${user.member_id}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        letterRendering: true,
        backgroundColor: '#ffffff',
        allowTaint: false,

        onclone: (clonedDoc) => {
          // Remove any problematic CSS that might contain oklch
          try {
            // Remove stylesheets with oklch
            const styleSheets = clonedDoc.styleSheets
            for (let i = 0; i < styleSheets.length; i++) {
              try {
                const sheet = styleSheets[i]
                if (sheet.cssRules) {
                  for (let j = sheet.cssRules.length - 1; j >= 0; j--) {
                    try {
                      const rule = sheet.cssRules[j]
                      if (rule.cssText && rule.cssText.includes('oklch')) {
                        sheet.deleteRule(j)
                      }
                    } catch (e) {
                      // Ignore individual rule errors
                    }
                  }
                }
              } catch (e) {
                // Cross-origin stylesheets may throw errors, ignore them
              }
            }
            
            // Add style element to preserve green color
            const styleElement = clonedDoc.createElement('style')
            styleElement.textContent = `
              #membership-certificate h1,
              #membership-certificate h2,
              #membership-certificate h3 {
                color: rgb(26, 95, 63) !important;
              }
              #membership-certificate p[style*="#1a5f3f"] {
                color: rgb(26, 95, 63) !important;
              }
            `
            clonedDoc.head.appendChild(styleElement)
            
            // Ensure green color is preserved - explicitly set it using RGB format
            const certificate = clonedDoc.getElementById('membership-certificate')
            if (certificate) {
              const greenColorRgb = 'rgb(26, 95, 63)'
              
              // Find all h1, h2, h3, and p elements that should have green color
              const elementsToCheck = certificate.querySelectorAll('h1, h2, h3, p')
              elementsToCheck.forEach((el) => {
                const htmlEl = el as HTMLElement
                const inlineStyle = htmlEl.getAttribute('style') || ''
                
                // If the element has green color in its inline style, ensure it's preserved
                if (inlineStyle.includes('#1a5f3f') || inlineStyle.includes('rgb(26, 95, 63)')) {
                  // Set color explicitly using RGB format (html2canvas handles RGB better)
                  htmlEl.style.color = greenColorRgb
                }
              })
            }
          } catch (e) {
            // If anything fails, continue anyway
            console.warn('Error processing certificate styles:', e)
          }
        },
      },
      jsPDF: {
        unit: 'mm',
        format: [297, 210] as [number, number], // A4 landscape
        orientation: 'landscape' as const,
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
    }

    // Generate and download PDF
    await html2pdf().set(opt).from(certificateElement).save()
  } finally {
    // Clean up React root and container
    if (root) {
      root.unmount()
    }
    if (container.parentNode) {
      document.body.removeChild(container)
    }
  }
}
