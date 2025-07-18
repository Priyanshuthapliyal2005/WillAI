import { WillData } from '@/types/will-types'

export function generateWillHTML(data: WillData): string {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getBeneficiaryName = (beneficiaryId: string) => {
    const beneficiary = data.beneficiaries.find(b => b.id === beneficiaryId)
    return beneficiary ? beneficiary.name : 'Unknown Beneficiary'
  }

  const formatOrdinal = (num: number) => {
    const suffixes = ['th', 'st', 'nd', 'rd']
    const v = num % 100
    return num + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0])
  }

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`
  }

  return `
    <div class="will-document">
      <!-- Document Header -->
      <header class="will-header">
        <h1 class="will-title">LAST WILL AND TESTAMENT</h1>
        <h2 class="testator-name">OF ${data.testator.fullName.toUpperCase()}</h2>
      </header>

      <!-- Declaration and Revocation -->
      <section class="will-section">
        <h2 class="section-title">I. DECLARATION AND REVOCATION OF PRIOR WILLS</h2>
        <div class="text-paragraph">
          <p>
            I, <strong>${data.testator.fullName}</strong>, aged ${data.testator.age} years, 
            ${data.testator.occupation ? `${data.testator.occupation} by profession,` : ''} 
            residing at ${data.testator.address}, 
            ${data.testator.idNumber ? `bearing identification number ${data.testator.idNumber},` : ''} 
            being of sound mind and disposing memory, and not acting under duress, menace, fraud, 
            or undue influence of any person whomsoever, do hereby make, publish, and declare this 
            to be my Last Will and Testament, hereby expressly revoking all wills and codicils 
            heretofore made by me.
          </p>
          <p>
            I declare that I am making this Will of my own free will and volition, without 
            any coercion, pressure, or undue influence from any person whatsoever. I am fully 
            aware of the nature and extent of my property and of the claims of all persons who 
            might expect to benefit from my estate.
          </p>
        </div>
      </section>

      <!-- Beneficiaries -->
      ${data.beneficiaries && data.beneficiaries.length > 0 ? `
        <section class="will-section">
          <h2 class="section-title">II. BENEFICIARIES</h2>
          <div class="text-paragraph">
            <p>
              I hereby declare that the following persons are my beneficiaries under this Will:
            </p>
          </div>
          <div class="beneficiary-table">
            <table>
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>Name of Beneficiary</th>
                  <th>Relation to Testator</th>
                  <th>Age</th>
                  <th>Identification Number</th>
                  <th>Address</th>
                </tr>
              </thead>
              <tbody>
                ${data.beneficiaries.map((beneficiary, index) => `
                  <tr>
                    <td>${index + 1}</td>
                    <td>${beneficiary.name}</td>
                    <td>${beneficiary.relation}</td>
                    <td>${beneficiary.age ? `${beneficiary.age} years` : 'N/A'}</td>
                    <td>${beneficiary.idNumber || 'N/A'}</td>
                    <td>${beneficiary.address}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </section>
      ` : ''}

      <!-- Movable Assets -->
      <section class="will-section">
        <h2 class="section-title">III. DISPOSITION OF MOVABLE ASSETS</h2>
        
        ${data.movableAssets?.bankAccounts && data.movableAssets.bankAccounts.length > 0 ? `
          <div class="asset-subsection">
            <h3 class="subsection-title">A. Bank Accounts and Deposits</h3>
            <div class="text-paragraph">
              <p>
                I give, devise, and bequeath the following bank accounts and deposits 
                to the respective beneficiaries mentioned herein:
              </p>
            </div>
            <div class="asset-table">
              <table>
                <thead>
                  <tr>
                    <th>S.No.</th>
                    <th>Bank Name & Branch</th>
                    <th>Account Number</th>
                    <th>Account Type</th>
                    <th>Beneficiary</th>
                    <th>% Share</th>
                  </tr>
                </thead>
                <tbody>
                  ${data.movableAssets.bankAccounts.map((account, index) => `
                    <tr>
                      <td>${index + 1}</td>
                      <td>${account.bankName}${account.branch ? `, ${account.branch}` : ''}</td>
                      <td>${account.accountNumber}</td>
                      <td>${account.accountType}</td>
                      <td>${getBeneficiaryName(account.beneficiaryId)}</td>
                      <td>${account.sharePercentage || '100'}%</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        ` : ''}

        ${data.movableAssets?.insurancePolicies && data.movableAssets.insurancePolicies.length > 0 ? `
          <div class="asset-subsection">
            <h3 class="subsection-title">B. Insurance Policies</h3>
            <div class="text-paragraph">
              <p>
                I give, devise, and bequeath the following insurance policies 
                to the respective beneficiaries mentioned herein:
              </p>
            </div>
            <div class="asset-table">
              <table>
                <thead>
                  <tr>
                    <th>S.No.</th>
                    <th>Insurance Company</th>
                    <th>Policy Number</th>
                    <th>Policy Type</th>
                    <th>Sum Assured</th>
                    <th>Beneficiary</th>
                    <th>% Share</th>
                  </tr>
                </thead>
                <tbody>
                  ${data.movableAssets.insurancePolicies.map((policy, index) => `
                    <tr>
                      <td>${index + 1}</td>
                      <td>${policy.company}</td>
                      <td>${policy.policyNumber}</td>
                      <td>${policy.policyType}</td>
                      <td>${policy.sumAssured ? formatCurrency(policy.sumAssured) : 'N/A'}</td>
                      <td>${getBeneficiaryName(policy.beneficiaryId)}</td>
                      <td>${policy.sharePercentage || '100'}%</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        ` : ''}

        ${data.movableAssets?.stocks && data.movableAssets.stocks.length > 0 ? `
          <div class="asset-subsection">
            <h3 class="subsection-title">C. Stocks and Securities</h3>
            <div class="text-paragraph">
              <p>
                I give, devise, and bequeath the following stocks and securities 
                to the respective beneficiaries mentioned herein:
              </p>
            </div>
            <div class="asset-table">
              <table>
                <thead>
                  <tr>
                    <th>S.No.</th>
                    <th>Company/Brokerage</th>
                    <th>Account/Certificate Number</th>
                    <th>Number of Shares</th>
                    <th>Beneficiary</th>
                    <th>% Share</th>
                  </tr>
                </thead>
                <tbody>
                  ${data.movableAssets.stocks.map((stock, index) => `
                    <tr>
                      <td>${index + 1}</td>
                      <td>${stock.company}</td>
                      <td>${stock.certificateNumber || stock.accountNumber || 'N/A'}</td>
                      <td>${stock.numberOfShares || 'N/A'}</td>
                      <td>${getBeneficiaryName(stock.beneficiaryId)}</td>
                      <td>${stock.sharePercentage || '100'}%</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        ` : ''}

        ${data.movableAssets?.mutualFunds && data.movableAssets.mutualFunds.length > 0 ? `
          <div class="asset-subsection">
            <h3 class="subsection-title">D. Mutual Fund Investments</h3>
            <div class="text-paragraph">
              <p>
                I give, devise, and bequeath the following mutual fund investments 
                to the respective beneficiaries mentioned herein:
              </p>
            </div>
            <div class="asset-table">
              <table>
                <thead>
                  <tr>
                    <th>S.No.</th>
                    <th>Fund Name/Distributor</th>
                    <th>Folio/Account Number</th>
                    <th>Number of Units</th>
                    <th>Beneficiary</th>
                    <th>% Share</th>
                  </tr>
                </thead>
                <tbody>
                  ${data.movableAssets.mutualFunds.map((fund, index) => `
                    <tr>
                      <td>${index + 1}</td>
                      <td>${fund.fundName || fund.distributor}</td>
                      <td>${fund.folioNumber || fund.accountNumber}</td>
                      <td>${fund.units || 'N/A'}</td>
                      <td>${getBeneficiaryName(fund.beneficiaryId)}</td>
                      <td>${fund.sharePercentage || '100'}%</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        ` : ''}
      </section>

      <!-- Physical Assets -->
      ${data.physicalAssets?.jewellery && data.physicalAssets.jewellery.length > 0 ? `
        <section class="will-section">
          <h2 class="section-title">IV. DISPOSITION OF PHYSICAL ASSETS</h2>
          <div class="asset-subsection">
            <h3 class="subsection-title">A. Jewellery and Precious Items</h3>
            <div class="text-paragraph">
              <p>
                I give, devise, and bequeath the following jewellery and precious items 
                to the respective beneficiaries mentioned herein:
              </p>
            </div>
            <div class="asset-table">
              <table>
                <thead>
                  <tr>
                    <th>S.No.</th>
                    <th>Type/Description</th>
                    <th>Invoice Number</th>
                    <th>Estimated Value</th>
                    <th>Location</th>
                    <th>Beneficiary</th>
                    <th>% Share</th>
                  </tr>
                </thead>
                <tbody>
                  ${data.physicalAssets.jewellery.map((item, index) => `
                    <tr>
                      <td>${index + 1}</td>
                      <td>${item.description || item.type}</td>
                      <td>${item.invoiceNumber || 'N/A'}</td>
                      <td>${item.estimatedValue ? formatCurrency(item.estimatedValue) : 'N/A'}</td>
                      <td>${item.location || 'N/A'}</td>
                      <td>${getBeneficiaryName(item.beneficiaryId)}</td>
                      <td>${item.sharePercentage || '100'}%</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      ` : ''}

      <!-- Immovable Assets -->
      ${data.immovableAssets && data.immovableAssets.length > 0 ? `
        <section class="will-section">
          <h2 class="section-title">V. DISPOSITION OF IMMOVABLE ASSETS</h2>
          <div class="text-paragraph">
            <p>
              I give, devise, and bequeath the following immovable properties 
              to the respective beneficiaries mentioned herein:
            </p>
          </div>
          <div class="asset-table">
            <table>
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>Property Type</th>
                  <th>Description/Name</th>
                  <th>Location</th>
                  <th>Registration Number</th>
                  <th>Estimated Value</th>
                  <th>Beneficiary</th>
                  <th>% Share</th>
                </tr>
              </thead>
              <tbody>
                ${data.immovableAssets.map((asset, index) => `
                  <tr>
                    <td>${index + 1}</td>
                    <td>${asset.propertyType}</td>
                    <td>${asset.description || asset.name}</td>
                    <td>${asset.location}</td>
                    <td>${asset.registrationNumber || asset.surveyNumber || 'N/A'}</td>
                    <td>${asset.estimatedValue ? formatCurrency(asset.estimatedValue) : 'N/A'}</td>
                    <td>${getBeneficiaryName(asset.beneficiaryId)}</td>
                    <td>${asset.sharePercentage || '100'}%</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </section>
      ` : ''}

      <!-- Residual Clause -->
      <section class="will-section">
        <h2 class="section-title">VI. RESIDUAL CLAUSE</h2>
        <div class="text-paragraph">
          <p>
            ${data.residualClause || `All the rest, residue, and remainder of my estate, both real and personal, 
            of whatsoever nature and wheresoever situated, which I may own or be entitled 
            to at the time of my death, not otherwise specifically disposed of by this Will 
            or any codicil hereto, I give, devise, and bequeath to my beneficiaries as 
            mentioned in this Will, to be divided among them in equal shares, or as they 
            may mutually agree, or as determined by my executors in their absolute discretion.`}
          </p>
        </div>
      </section>

      <!-- Executors -->
      ${data.executors && data.executors.length > 0 ? `
        <section class="will-section">
          <h2 class="section-title">VII. EXECUTORS</h2>
          <div class="text-paragraph">
            <p>
              I hereby nominate and appoint the following person(s) to be the Executor(s) of this my Last Will 
              and Testament, with full power to administer my estate, both real and personal, forming part of my estate, 
              without the necessity of obtaining any court order or approval:
            </p>
          </div>
          <div class="executor-table">
            <table>
              <thead>
                <tr>
                  <th>NAME</th>
                  <th>RELATIONSHIP</th>
                  <th>ADDRESS</th>
                  <th>PHONE</th>
                  <th>PRIMARY EXECUTOR</th>
                </tr>
              </thead>
              <tbody>
                ${data.executors.map((executor) => `
                  <tr>
                    <td>${executor.name}</td>
                    <td>${executor.relation}</td>
                    <td>${executor.address}</td>
                    <td>${executor.phone || 'N/A'}</td>
                    <td>${executor.isPrimary ? 'Yes' : 'No'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          <div class="text-paragraph">
            <p>
              If the primary Executor named above is unable or unwilling to serve, or ceases to serve for any 
              reason, then the alternate Executor (if named) shall serve in their place.
            </p>
          </div>
        </section>
      ` : ''}

      <!-- Guardian Clause -->
      ${data.guardianClause ? `
        <section class="will-section">
          <h2 class="section-title">VIII. APPOINTMENT OF GUARDIAN</h2>
          <div class="text-paragraph">
            <p>
              ${data.guardianClause.condition || `In the event that any of my children are minors at the time of my death,`} 
              I hereby nominate, constitute, and appoint <strong>${data.guardianClause.guardian.name}</strong>, 
              ${data.guardianClause.guardian.relation}, residing at ${data.guardianClause.guardian.address}, 
              as the guardian of the person and property of my minor children${data.guardianClause.minorChildren ? ', namely:' : '.'}
            </p>
            ${data.guardianClause.minorChildren ? `
              <ul>
                ${data.guardianClause.minorChildren.map(child => `<li>${child}</li>`).join('')}
              </ul>
            ` : ''}
            <p>
              I direct that no bond or other security shall be required of the said guardian 
              in any jurisdiction, and I request that the said guardian serve without compensation, 
              although the guardian may be reimbursed for reasonable expenses incurred in the 
              performance of guardian duties.
            </p>
          </div>
        </section>
      ` : ''}

      <!-- Liabilities -->
      ${data.liabilities && data.liabilities.length > 0 ? `
        <section class="will-section">
          <h2 class="section-title">IX. PAYMENT OF DEBTS AND LIABILITIES</h2>
          <div class="text-paragraph">
            <p>
              I direct that all my just debts, funeral expenses, and the expenses of 
              administering my estate be paid as soon as practicable after my death. 
              ${data.liabilities.length > 0 ? 'The following specific liabilities shall be settled from my estate:' : ''}
            </p>
            ${data.liabilities.length > 0 ? `
              <ul>
                ${data.liabilities.map(liability => `<li>${liability}</li>`).join('')}
              </ul>
            ` : ''}
            <p>
              On my death, the beneficiaries shall equally bear the administration expenses of Will Execution 
              and shall discharge my debts/liabilities from respective assets attached to the liabilities if any.
            </p>
          </div>
        </section>
      ` : ''}

      <!-- Special Instructions -->
      ${data.specialInstructions ? `
        <section class="will-section">
          <h2 class="section-title">X. SPECIAL INSTRUCTIONS</h2>
          <div class="text-paragraph">
            <p>${data.specialInstructions}</p>
          </div>
        </section>
      ` : ''}

      <!-- Signature Section -->
      <section class="will-section">
        <h2 class="section-title">XI. EXECUTION</h2>
        <div class="execution-content">
          <div class="execution-layout">
            <div class="execution-left">
              <p>IN WITNESS WHEREOF, I have hereunto set my hand and seal this ${formatOrdinal(new Date(data.dateOfWill).getDate())} day of ${new Date(data.dateOfWill).toLocaleDateString('en-US', { month: 'long' })}, ${new Date(data.dateOfWill).getFullYear()}, at ${data.placeOfWill}.</p>
            </div>
            
            <div class="execution-right">
              <div class="signature-section">
                <div class="signature-label">Signature of Testator</div>
                <div class="testator-signature-block">
                  <div class="testator-name">${data.testator.fullName.toUpperCase()}</div>
                </div>
              </div>
              
              <div class="execution-details">
                <div class="detail-row">
                  <span class="detail-label">Date:</span>
                  <span class="detail-value">${new Date(data.dateOfWill).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Place:</span>
                  <span class="detail-value">${data.placeOfWill}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Witnesses -->
      ${data.witnesses && data.witnesses.length > 0 ? `
        <section class="will-section">
          <h2 class="section-title">XII. WITNESS ATTESTATION</h2>
          <div class="text-paragraph">
            <p>
              The foregoing instrument, consisting of [Number of Pages] pages, including this page, was signed, published, and declared by the above-named Testator, <strong>${data.testator.fullName}</strong>, as his/her Last Will and Testament, in our joint presence, and we, at his/her request, in his/her presence, and in the presence of each other, have hereunto subscribed our names as witnesses on the date last above written.
            </p>
          </div>
          
          <!-- Witness Details Table -->
          <div class="witness-table">
            <table>
              <thead>
                <tr>
                  <th>WITNESS NAME</th>
                  <th>ADDRESS</th>
                  <th>OCCUPATION</th>
                  <th>ID NUMBER</th>
                </tr>
              </thead>
              <tbody>
                ${data.witnesses.filter(witness => witness && witness.name).map((witness, index) => `
                  <tr>
                    <td>${witness.name || 'N/A'}</td>
                    <td>${witness.address || 'N/A'}</td>
                    <td>${witness.occupation || 'N/A'}</td>
                    <td>${witness.idNumber || 'N/A'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          
          <!-- Witness Signature Section -->
          <div class="witness-signatures">
            <div class="signature-grid">
              ${data.witnesses.filter(witness => witness && witness.name).map((witness, index) => `
                <div class="witness-signature-block">
                  <div class="signature-line">
                    <div class="signature-placeholder"></div>
                    <div class="signature-label">Signature of Witness ${index + 1}</div>
                  </div>
                  <div class="witness-details">
                    <p><strong>Name:</strong> ${witness.name || 'N/A'}</p>
                    <p><strong>Address:</strong> ${witness.address || 'N/A'}</p>
                    <p><strong>Phone:</strong> ${witness.phone || 'N/A'}</p>
                    <p><strong>Occupation:</strong> ${witness.occupation || 'N/A'}</p>
                    <p><strong>ID Number:</strong> ${witness.idNumber || 'N/A'}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </section>
      ` : `
        <!-- No Witnesses Found -->
        <section class="will-section">
          <h2 class="section-title">XII. WITNESS ATTESTATION</h2>
          <div class="text-paragraph">
            <div style="color: red; font-weight: bold; background-color: #fee; padding: 1rem; border: 2px solid red; border-radius: 8px; margin: 1rem 0;">
              <p><strong>⚠️ ERROR: No valid witnesses found!</strong></p>
              <p>At least two witnesses with complete information are required for a valid will.</p>
              <p>Please go back to the witnesses section and add witness information.</p>
            </div>
          </div>
        </section>
      `}
      <!-- Footer -->
      <footer class="will-footer">
        <div class="document-info">
          <p><strong>End of Last Will and Testament</strong></p>
          <p>This Will was executed on ${formatDate(data.dateOfWill)} at ${data.placeOfWill}.</p>
          <p>Generated on ${formatDate(new Date().toISOString())}</p>
        </div>
      </footer>
    </div>
  `
}