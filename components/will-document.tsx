'use client';

import { WillData } from '@/types/will-types';

interface WillDocumentProps {
  data: WillData;
}

export function WillDocument({ data }: WillDocumentProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getBeneficiaryName = (beneficiaryId: string) => {
    const beneficiary = data.beneficiaries.find(b => b.id === beneficiaryId);
    return beneficiary ? beneficiary.name : 'Unknown Beneficiary';
  };

  const formatOrdinal = (num: number) => {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const v = num % 100;
    return num + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
  };

  return (
    <article className="will-document">
      {/* Document Header */}
      <header className="will-header">
        <h1 className="will-title">LAST WILL AND TESTAMENT</h1>
        <h2 className="testator-name">OF {data.testator.fullName.toUpperCase()}</h2>
      </header>

      {/* Declaration and Revocation */}
      <section className="will-section">
        <h2 className="section-title">I. DECLARATION AND REVOCATION OF PRIOR WILLS</h2>
        <div className="text-paragraph">
          <p>
            I, <strong>{data.testator.fullName}</strong>, aged {data.testator.age} years, 
            son/daughter/spouse of ____________, residing at {data.testator.address}, 
            being of sound mind and disposing memory, and not acting under duress, menace, 
            fraud, or undue influence of any person whomsoever, do hereby make, publish, 
            and declare this to be my Last Will and Testament, hereby expressly revoking 
            all wills and codicils heretofore made by me.
          </p>
          <p>
            I am a {data.testator.occupation} by profession and hold identification 
            number {data.testator.idNumber}. I declare that I am making this Will of my 
            own free will and volition, without any coercion, pressure, or undue influence 
            from any person whatsoever.
          </p>
        </div>
      </section>

      {/* Beneficiaries */}
      {data.beneficiaries.length > 0 && (
        <section className="will-section">
          <h2 className="section-title">II. BENEFICIARIES</h2>
          <div className="text-paragraph">
            <p>
              I hereby declare that the following persons are my beneficiaries under this Will:
            </p>
          </div>
          <div className="beneficiary-table">
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
                {data.beneficiaries.map((beneficiary, index) => (
                  <tr key={beneficiary.id}>
                    <td>{index + 1}</td>
                    <td>{beneficiary.name}</td>
                    <td>{beneficiary.relation}</td>
                    <td>{beneficiary.age} years</td>
                    <td>{beneficiary.idNumber}</td>
                    <td>{beneficiary.address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Movable Assets */}
      <section className="will-section">
        <h2 className="section-title">III. DISPOSITION OF MOVABLE ASSETS</h2>
        
        {/* Bank Accounts */}
        {data.movableAssets.bankAccounts.length > 0 && (
          <div className="asset-subsection">
            <h3 className="subsection-title">A. Bank Accounts and Deposits</h3>
            <div className="text-paragraph">
              <p>
                I give, devise, and bequeath the following bank accounts and deposits 
                to the respective beneficiaries mentioned herein:
              </p>
            </div>
            <div className="asset-table">
              <table>
                <thead>
                  <tr>
                    <th>S.No.</th>
                    <th>Bank Name & Branch</th>
                    <th>Account Number</th>
                    <th>Account Type</th>
                    <th>Beneficiary</th>
                  </tr>
                </thead>
                <tbody>
                  {data.movableAssets.bankAccounts.map((account, index) => (
                    <tr key={account.id}>
                      <td>{index + 1}</td>
                      <td>{account.bankName}, {account.branch}</td>
                      <td>{account.accountNumber}</td>
                      <td>{account.accountType}</td>
                      <td>{getBeneficiaryName(account.beneficiaryId)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Insurance Policies */}
        {data.movableAssets.insurancePolicies.length > 0 && (
          <div className="asset-subsection">
            <h3 className="subsection-title">B. Insurance Policies</h3>
            <div className="text-paragraph">
              <p>
                I give, devise, and bequeath the following insurance policies 
                to the respective beneficiaries mentioned herein:
              </p>
            </div>
            <div className="asset-table">
              <table>
                <thead>
                  <tr>
                    <th>S.No.</th>
                    <th>Insurance Company</th>
                    <th>Policy Number</th>
                    <th>Policy Type</th>
                    <th>Sum Assured</th>
                    <th>Beneficiary</th>
                  </tr>
                </thead>
                <tbody>
                  {data.movableAssets.insurancePolicies.map((policy, index) => (
                    <tr key={policy.id}>
                      <td>{index + 1}</td>
                      <td>{policy.company}</td>
                      <td>{policy.policyNumber}</td>
                      <td>{policy.policyType}</td>
                      <td>₹{policy.sumAssured.toLocaleString('en-IN')}</td>
                      <td>{getBeneficiaryName(policy.beneficiaryId)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Stocks */}
        {data.movableAssets.stocks.length > 0 && (
          <div className="asset-subsection">
            <h3 className="subsection-title">C. Stocks and Securities</h3>
            <div className="text-paragraph">
              <p>
                I give, devise, and bequeath the following stocks and securities 
                to the respective beneficiaries mentioned herein:
              </p>
            </div>
            <div className="asset-table">
              <table>
                <thead>
                  <tr>
                    <th>S.No.</th>
                    <th>Company Name</th>
                    <th>Number of Shares</th>
                    <th>Certificate Number</th>
                    <th>Beneficiary</th>
                  </tr>
                </thead>
                <tbody>
                  {data.movableAssets.stocks.map((stock, index) => (
                    <tr key={stock.id}>
                      <td>{index + 1}</td>
                      <td>{stock.company}</td>
                      <td>{stock.numberOfShares}</td>
                      <td>{stock.certificateNumber || 'N/A'}</td>
                      <td>{getBeneficiaryName(stock.beneficiaryId)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Mutual Funds */}
        {data.movableAssets.mutualFunds.length > 0 && (
          <div className="asset-subsection">
            <h3 className="subsection-title">D. Mutual Fund Investments</h3>
            <div className="text-paragraph">
              <p>
                I give, devise, and bequeath the following mutual fund investments 
                to the respective beneficiaries mentioned herein:
              </p>
            </div>
            <div className="asset-table">
              <table>
                <thead>
                  <tr>
                    <th>S.No.</th>
                    <th>Fund Name</th>
                    <th>Folio Number</th>
                    <th>Number of Units</th>
                    <th>Beneficiary</th>
                  </tr>
                </thead>
                <tbody>
                  {data.movableAssets.mutualFunds.map((fund, index) => (
                    <tr key={fund.id}>
                      <td>{index + 1}</td>
                      <td>{fund.fundName}</td>
                      <td>{fund.folioNumber}</td>
                      <td>{fund.units}</td>
                      <td>{getBeneficiaryName(fund.beneficiaryId)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* Physical Assets */}
      {data.physicalAssets.jewellery.length > 0 && (
        <section className="will-section">
          <h2 className="section-title">IV. DISPOSITION OF PHYSICAL ASSETS</h2>
          <div className="asset-subsection">
            <h3 className="subsection-title">A. Jewellery and Precious Items</h3>
            <div className="text-paragraph">
              <p>
                I give, devise, and bequeath the following jewellery and precious items 
                to the respective beneficiaries mentioned herein:
              </p>
            </div>
            <div className="asset-table">
              <table>
                <thead>
                  <tr>
                    <th>S.No.</th>
                    <th>Description</th>
                    <th>Estimated Value</th>
                    <th>Location</th>
                    <th>Beneficiary</th>
                  </tr>
                </thead>
                <tbody>
                  {data.physicalAssets.jewellery.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item.description}</td>
                      <td>₹{item.estimatedValue.toLocaleString('en-IN')}</td>
                      <td>{item.location}</td>
                      <td>{getBeneficiaryName(item.beneficiaryId)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Immovable Assets */}
      {data.immovableAssets.length > 0 && (
        <section className="will-section">
          <h2 className="section-title">V. DISPOSITION OF IMMOVABLE ASSETS</h2>
          <div className="text-paragraph">
            <p>
              I give, devise, and bequeath the following immovable properties 
              to the respective beneficiaries mentioned herein:
            </p>
          </div>
          <div className="asset-table">
            <table>
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>Property Type</th>
                  <th>Description</th>
                  <th>Location</th>
                  <th>Survey/Registration No.</th>
                  <th>Estimated Value</th>
                  <th>Beneficiary</th>
                </tr>
              </thead>
              <tbody>
                {data.immovableAssets.map((asset, index) => (
                  <tr key={asset.id}>
                    <td>{index + 1}</td>
                    <td>{asset.propertyType}</td>
                    <td>{asset.description}</td>
                    <td>{asset.location}</td>
                    <td>{asset.surveyNumber || asset.registrationNumber || 'N/A'}</td>
                    <td>₹{asset.estimatedValue.toLocaleString('en-IN')}</td>
                    <td>{getBeneficiaryName(asset.beneficiaryId)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Residual Clause */}
      <section className="will-section">
        <h2 className="section-title">VI. RESIDUAL CLAUSE</h2>
        <div className="text-paragraph">
          <p>
            All the rest, residue, and remainder of my estate, both real and personal, 
            of whatsoever nature and wheresoever situated, which I may own or be entitled 
            to at the time of my death, not otherwise specifically disposed of by this Will 
            or any codicil hereto, I give, devise, and bequeath to my beneficiaries as 
            mentioned in this Will, to be divided among them in equal shares, or as they 
            may mutually agree, or as determined by my executors in their absolute discretion.
          </p>
        </div>
      </section>

      {/* Guardian Clause */}
      {data.guardianClause && (
        <section className="will-section">
          <h2 className="section-title">VII. APPOINTMENT OF GUARDIAN</h2>
          <div className="text-paragraph">
            <p>
              In the event that any of my children are minors at the time of my death, 
              I hereby nominate, constitute, and appoint <strong>{data.guardianClause.guardian.name}</strong>, 
              {data.guardianClause.guardian.relation}, residing at {data.guardianClause.guardian.address}, 
              as the guardian of the person and property of my minor children, namely:
            </p>
            <ul>
              {data.guardianClause.minorChildren.map((child, index) => (
                <li key={index}>{child}</li>
              ))}
            </ul>
            <p>
              I direct that no bond or other security shall be required of the said guardian 
              in any jurisdiction, and I request that the said guardian serve without compensation, 
              although the guardian may be reimbursed for reasonable expenses incurred in the 
              performance of guardian duties.
            </p>
          </div>
        </section>
      )}

      {/* Liabilities */}
      {data.liabilities.length > 0 && (
        <section className="will-section">
          <h2 className="section-title">VIII. PAYMENT OF DEBTS AND LIABILITIES</h2>
          <div className="text-paragraph">
            <p>
              I direct that all my just debts, funeral expenses, and the expenses of 
              administering my estate be paid as soon as practicable after my death. 
              The following specific liabilities shall be settled from my estate:
            </p>
            <ul>
              {data.liabilities.map((liability, index) => (
                <li key={index}>{liability}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Executors */}
      {data.executors.length > 0 && (
        <section className="will-section">
          <h2 className="section-title">IX. APPOINTMENT OF EXECUTORS</h2>
          <div className="text-paragraph">
            <p>
              I hereby nominate, constitute, and appoint the following person(s) as 
              executor(s) of this my Last Will and Testament, with full power and authority 
              to carry out the provisions hereof:
            </p>
          </div>
          <div className="executor-table">
            <table>
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>Name</th>
                  <th>Relation</th>
                  <th>Address</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {data.executors.map((executor, index) => (
                  <tr key={executor.id}>
                    <td>{index + 1}</td>
                    <td>{executor.name}</td>
                    <td>{executor.relation}</td>
                    <td>{executor.address}</td>
                    <td>{executor.phone}</td>
                    <td>{executor.email || 'N/A'}</td>
                    <td>{executor.isPrimary ? 'Primary Executor' : 'Executor'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-paragraph">
            <p>
              I direct that no bond or other security shall be required of any executor 
              named herein in any jurisdiction. If any executor named herein shall predecease 
              me, or shall renounce, or shall be unable or unwilling to serve, then the 
              remaining executor(s) shall serve alone.
            </p>
          </div>
        </section>
      )}

      {/* Special Instructions */}
      {data.specialInstructions && (
        <section className="will-section">
          <h2 className="section-title">X. SPECIAL INSTRUCTIONS</h2>
          <div className="text-paragraph">
            <p>{data.specialInstructions}</p>
          </div>
        </section>
      )}

      {/* Signature Section */}
      <section className="will-section">
        <h2 className="section-title">XI. EXECUTION AND ATTESTATION</h2>
        <div className="text-paragraph">
          <p>
            IN WITNESS WHEREOF, I have hereunto set my hand and seal at {data.placeOfWill} 
            on this {formatOrdinal(new Date(data.dateOfWill).getDate())} day of{' '}
            {new Date(data.dateOfWill).toLocaleDateString('en-US', { month: 'long' })},{' '}
            {new Date(data.dateOfWill).getFullYear()}.
          </p>
        </div>
        
        <div className="signature-section">
          <div className="testator-signature">
            <div className="digital-signature">
              <p className="signature-name"><strong>{data.testator.fullName}</strong></p>
              <p className="signature-role">(Testator)</p>
              <p className="signature-note">Digital Signature</p>
            </div>
          </div>
          
          <div className="execution-details">
            <p><strong>Date:</strong> {formatDate(data.dateOfWill)}</p>
            <p><strong>Place:</strong> {data.placeOfWill}</p>
            <p><strong>ID Number:</strong> {data.testator.idNumber}</p>
          </div>
        </div>
      </section>

      {/* Witnesses */}
      {data.witnesses.length > 0 && (
        <section className="will-section">
          <h2 className="section-title">XII. ATTESTATION BY WITNESSES</h2>
          <div className="text-paragraph">
            <p>
              The foregoing instrument was signed by the said {data.testator.fullName} as and 
              for their Last Will and Testament in the presence of us, who, at their request, 
              in their presence, and in the presence of each other, have hereunto subscribed 
              our names as witnesses on the date last above written.
            </p>
          </div>
          
          <div className="witnesses-section">
            {data.witnesses.map((witness, index) => (
              <div key={witness.id} className="witness-block">
                <h4 className="witness-title">WITNESS {index + 1}</h4>
                <div className="witness-details">
                  <div className="witness-info">
                    <p><strong>Name:</strong> {witness.name}</p>
                    <p><strong>Occupation:</strong> {witness.occupation}</p>
                    <p><strong>ID Number:</strong> {witness.idNumber}</p>
                    <p><strong>Phone:</strong> {witness.phone}</p>
                    <p><strong>Address:</strong> {witness.address}</p>
                  </div>
                  <div className="witness-signature">
                    <div className="digital-signature">
                      <p className="signature-name"><strong>{witness.name}</strong></p>
                      <p className="signature-role">(Witness {index + 1})</p>
                      <p className="signature-note">Digital Signature</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="will-footer">
        <div className="document-info">
          <p>This Will consists of {document.querySelectorAll('.will-section').length} sections and was executed on {formatDate(data.dateOfWill)} at {data.placeOfWill}.</p>
        </div>
      </footer>
    </article>
  );
}