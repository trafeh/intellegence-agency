<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenue sur votre Espace Client</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f8fafc;
            color: #0f172a;
            margin: 0;
            padding: 30px 15px;
        }
        .container {
            max-width: 580px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 16px;
            border: 1px solid #e2e8f0;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }
        .header {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            padding: 28px 32px;
            color: #ffffff;
        }
        .header h1 {
            margin: 0;
            font-size: 20px;
            font-weight: 800;
            letter-spacing: -0.5px;
        }
        .header p {
            margin: 6px 0 0 0;
            font-size: 13px;
            color: #94a3b8;
        }
        .body {
            padding: 32px;
        }
        .greeting {
            font-size: 16px;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 12px;
        }
        .text {
            font-size: 14px;
            line-height: 1.6;
            color: #334155;
            margin-bottom: 24px;
        }
        .credentials-card {
            background-color: #f1f5f9;
            border: 1px solid #cbd5e1;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 24px;
        }
        .credentials-title {
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #475569;
            margin-bottom: 12px;
        }
        .credential-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid #e2e8f0;
            font-size: 13px;
        }
        .credential-row:last-child {
            border-bottom: none;
            padding-bottom: 0;
        }
        .credential-label {
            color: #64748b;
            font-weight: 600;
        }
        .credential-value {
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            font-weight: 700;
            color: #0f172a;
        }
        .btn-wrapper {
            text-align: center;
            margin: 28px 0 20px 0;
        }
        .btn {
            display: inline-block;
            background-color: #2563eb;
            color: #ffffff !important;
            text-decoration: none;
            font-size: 14px;
            font-weight: 700;
            padding: 12px 28px;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
        }
        .security-note {
            font-size: 12px;
            color: #64748b;
            background: #fffbeb;
            border: 1px solid #fef3c7;
            padding: 12px;
            border-radius: 8px;
            line-height: 1.5;
        }
        .footer {
            padding: 20px 32px;
            background-color: #f8fafc;
            border-top: 1px solid #f1f5f9;
            text-align: center;
            font-size: 12px;
            color: #94a3b8;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Intelligence Sales CRM</h1>
            <p>Demande de Devis &bull; R&eacute;f : {{ $quoteRef }}</p>
        </div>

        <div class="body">
            <div class="greeting">Bonjour {{ $clientName }},</div>
            <p class="text">
                Nous avons bien re&ccedil;u votre demande de cotation pour <strong>{{ $companyName }}</strong>.
                Notre &eacute;quipe commerciale examine actuellement vos besoins afin de vous &eacute;tablir un devis chiffr&eacute; d&eacute;taill&eacute;.
            </p>
            <p class="text">
                Un Espace Client B2B a &eacute;t&eacute; cr&eacute;&eacute; pour vous permettre de suivre vos devis, signer vos bons de commande et &eacute;changer directement avec votre charg&eacute; d'affaires d&eacute;di&eacute; :
            </p>

            <div class="credentials-card">
                <div class="credentials-title">Vos identifiants d'acc&egrave;s</div>
                <div class="credential-row">
                    <span class="credential-label">Identifiant (Email) :</span>
                    <span class="credential-value">{{ $email }}</span>
                </div>
                <div class="credential-row">
                    <span class="credential-label">Mot de passe temporaire :</span>
                    <span class="credential-value" style="color: #2563eb;">{{ $password ?? 'Déjà configuré' }}</span>
                </div>
                <div class="credential-row">
                    <span class="credential-label">Statut du compte :</span>
                    <span class="credential-value" style="color: #10b981;">Actif</span>
                </div>
            </div>

            <div class="btn-wrapper">
                <a href="{{ $loginUrl }}" class="btn">Acc&eacute;der &agrave; mon Espace Client &rarr;</a>
            </div>

            <div class="security-note">
                <strong>Conseil de s&eacute;curit&eacute; :</strong> Lors de votre premi&egrave;re connexion, nous vous conseillons de modifier votre mot de passe temporaire dans la section Param&egrave;tres de votre profil.
            </div>
        </div>

        <div class="footer">
            &copy; {{ date('Y') }} Intelligence Sales Platform. Tous droits r&eacute;serv&eacute;s.
        </div>
    </div>
</body>
</html>
